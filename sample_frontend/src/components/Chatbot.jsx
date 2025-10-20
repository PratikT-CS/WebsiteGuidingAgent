import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Headset, Play } from "lucide-react";
import "./Chatbot.css";

// Configuration
const AGENT_API_URL =
  "https://1986wwwa53.execute-api.us-east-1.amazonaws.com/agent-invocation";
// const WS_URL = "ws://127.0.0.1:8000/ws";
const WS_URL =
  "wss://zqkltcnh87.execute-api.us-east-1.amazonaws.com/development";

// Voice Activity Detection Configuration
const VAD_CONFIG = {
  SILENCE_THRESHOLD: 0.15, // Minimum audio level to consider as speech
  SILENCE_DURATION: 1500, // Milliseconds of silence before considering speech ended
  MIN_SPEECH_DURATION: 500, // Minimum speech duration to process
  MAX_SPEECH_DURATION: 30000, // Maximum speech duration before timeout
  SAMPLE_RATE: 16000,
  BUFFER_SIZE: 4096,
  RECONNECT_DELAY: 500, // Delay before reconnecting speech recognition (reduced for faster response)
};

// Tool Registry - Safe, whitelisted functions
const createToolRegistry = (
  navigate,
  wsConnection,
  conversationControls,
  setConversationMode
) => ({
  highlight_element: async ({ selector, duration = 2000 }) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);

    el.classList.add("agent-highlight");
    await new Promise((resolve) => setTimeout(resolve, duration));
    el.classList.remove("agent-highlight");
    return `Highlighted element ${selector} for ${duration}ms`;
  },

  fill_input: async ({ selector, value }) => {
    // Wait for element to be available (up to 5 seconds)
    let el = null;
    const maxWaitTime = 5000;
    const startTime = Date.now();

    while (!el && Date.now() - startTime < maxWaitTime) {
      el = document.querySelector(selector);
      if (!el) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    if (!el)
      throw new Error(
        `Element not found: ${selector} (waited ${maxWaitTime}ms)`
      );

    if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
      throw new Error(`Element is not an input field: ${selector}`);
    }

    el.value = value;
    // Dispatch standard events
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));

    // Dispatch custom event for React state synchronization
    const customEvent = new CustomEvent("agent-fill", {
      bubbles: true,
      detail: { value, selector },
    });

    el.dispatchEvent(customEvent);

    return `Filled input ${selector} with value '${value}'`;
  },

  navigate_to_page: async ({ path }) => {
    if (!path) throw new Error("Path is required for navigation");

    // Use React Router for navigation
    navigate(path);

    // Wait for navigation to complete and DOM to update
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Force scroll to top immediately (without smooth behavior for reliability)
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 1);
    setTimeout(() => {}, 1000);
    return `Navigated to ${path}`;
  },

  scroll_to_section: async ({ selector_id }) => {
    // Handle both cases: with and without # prefix
    let selector = selector_id;
    if (!selector.startsWith("#")) {
      selector = `#${selector}`;
    }

    const el = document.querySelector(selector);
    if (!el) throw new Error(`Section not found: ${selector_id}`);
    // el.scrollIntoView({ behavior: "smooth", inline: "start" });
    el.scrollIntoView({ behavior: "smooth", top: 0 });
    return `Scrolled to section ${selector_id}`;
  },

  click_element: async ({ selector }) => {
    // Wait for element to be available (up to 5 seconds)
    let el = null;
    const maxWaitTime = 5000;
    const startTime = Date.now();

    while (!el && Date.now() - startTime < maxWaitTime) {
      el = document.querySelector(selector);
      if (!el) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    if (!el)
      throw new Error(
        `Element not found: ${selector} (waited ${maxWaitTime}ms)`
      );

    el.click();
    return `Clicked element ${selector}`;
  },

  scroll_to_element: async ({ selector }) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for scroll to complete
    return `Scrolled to element ${selector}`;
  },

  end_call: async () => {
    setTimeout(() => {}, 10000);
    // End the current call/conversation by calling the same function as the "End Call" button
    if (conversationControls && conversationControls.stopConversation) {
      conversationControls.stopConversation();
    }
    return "Call ended successfully";
  },

  pause_call: async () => {
    // Pause the current call/conversation by calling the same function as the "Pause" button
    if (conversationControls && conversationControls.pauseConversation) {
      // First ensure we're in continuous mode and conversation is active
      setConversationMode("continuous");
      // Use a longer delay to ensure state updates are processed
      await new Promise((resolve) => setTimeout(resolve, 100));
      conversationControls.pauseConversation();
      return "Call paused successfully";
    } else {
      return "Error: Pause function not available";
    }
  },
});

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant here to help you to interact with our website. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // WebSocket connection state
  const [wsConnection, setWsConnection] = useState(null);
  const wsConnectionRef = useRef(null);
  const [clientId] = useState(
    () => `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // Tool execution queue state
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const toolQueueRef = useRef([]);
  const isProcessingRef = useRef(false);

  // Enhanced Speech-to-Speech state for continuous conversation
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [speakingTranscript, setSpeakingTranscript] = useState("");
  const [speechError, setSpeechError] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Continuous conversation state
  const [conversationMode, setConversationMode] = useState("manual"); // 'manual' | 'continuous' | 'paused'
  const [isInConversation, setIsInConversation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isWaitingForSpeech, setIsWaitingForSpeech] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [voiceState, setVoiceState] = useState("ready"); // 'idle' | 'ready' | 'listening' | 'speaking' | 'processing'

  // Chat interface state
  const [interfaceMode, setInterfaceMode] = useState("voice"); // 'voice' | 'chat'

  // Memory management state
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Speech API refs
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Voice Activity Detection refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const vadTimeoutRef = useRef(null);
  const speechStartTimeRef = useRef(null);
  const lastSpeechTimeRef = useRef(null);
  const isSpeechActiveRef = useRef(false);
  const speechQueueRef = useRef([]);
  const continuousModeRef = useRef(false);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // Conversation flow refs
  const isProcessingTranscriptRef = useRef(false);
  const lastProcessedTranscriptRef = useRef("");
  const handleMessageRef = useRef(null);
  const speakTextRef = useRef(null);
  const stopConversationRef = useRef(null);
  const safeStartRecognitionRef = useRef(null);
  const pauseConversationRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Memory management functions
  const clearMemory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/memory/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
        }),
      });

      if (response.ok) {
        // Reset conversation history in frontend
        setConversationHistory([]);
        setMessages([
          {
            id: 1,
            text: "Hello! I'm your AI assistant here to help you to interact with our website. How can I help you today?",
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error clearing memory:", error);
    }
  };

  const getMemorySummary = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/memory/summary/${clientId}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.summary;
      }
    } catch (error) {
      console.error("Error getting memory summary:", error);
    }
    return null;
  };

  const toggleMemory = () => {
    setMemoryEnabled(!memoryEnabled);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Voice Activity Detection is handled by browser's Speech Recognition API
  // No need for custom VAD implementation

  const handleContinuousMessage = useCallback(
    async (messageText) => {
      // Only process if we've welcomed the user
      if (!hasWelcomed) {
        return;
      }

      const userMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setIsProcessing(true);
      const currentLocation = window.location.pathname;
      try {
        const response = await fetch(AGENT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: currentLocation,
            query: messageText,
            client_id: memoryEnabled ? clientId : null, // Only send client_id if memory is enabled
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const agentResponse = await response.json();

        if (!agentResponse.content) {
          throw new Error("Invalid response format: missing content");
        }

        const aiResponse = {
          id: messages.length + 2,
          text: agentResponse.content,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsConnected(true);

        // Automatically speak the AI response
        if (autoSpeak && agentResponse.content) {
          setTimeout(() => {
            if (speakTextRef.current) {
              speakTextRef.current(agentResponse.content);
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error calling agent API:", error);
        setIsConnected(false);

        // Speak error message
        if (autoSpeak) {
          setTimeout(() => {
            if (speakTextRef.current) {
              speakTextRef.current("Sorry, there was an error.");
            }
          }, 500);
        }

        const fallbackResponse = {
          id: messages.length + 2,
          text: "Sorry, there was an error.",
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, fallbackResponse]);
      } finally {
        setIsTyping(false);
        setIsProcessing(false);
        isProcessingTranscriptRef.current = false;
      }
    },
    [messages.length, clientId, autoSpeak, hasWelcomed]
  );

  // Store the function in a ref so it can be called from event handlers
  handleMessageRef.current = handleContinuousMessage;

  // Continuous conversation control functions

  const stopContinuousConversation = useCallback(() => {
    continuousModeRef.current = false;
    setConversationMode("manual");
    setIsInConversation(false);
    setVoiceState("ready");
    setIsListening(false);
    isListeningRef.current = false;
    setIsProcessing(false);

    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Stop speech synthesis
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }

    // Clear any reconnect timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Clear simple restart interval
    if (simpleRestartRef.current) {
      clearInterval(simpleRestartRef.current);
      simpleRestartRef.current = null;
    }

    setCurrentTranscript("");
  }, []);

  // Store the function in a ref so it can be called from event handlers
  stopConversationRef.current = stopContinuousConversation;

  // Helper function to safely start speech recognition
  const safeStartRecognition = useCallback(() => {
    if (!speechSupported || !recognitionRef.current) {
      return false;
    }

    if (!continuousModeRef.current || conversationMode !== "continuous") {
      return false;
    }

    try {
      // Always stop first to avoid "already started" error
      if (isListeningRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        isListeningRef.current = false;

        // Wait for stop to complete before starting
        setTimeout(() => {
          try {
            if (
              recognitionRef.current &&
              !isListeningRef.current &&
              continuousModeRef.current &&
              conversationMode === "continuous"
            ) {
              recognitionRef.current.start();
              // State will be set by onstart handler
            }
          } catch (error) {
            console.error("Error starting recognition after stop:", error);
          }
        }, 300);
        return true;
      } else {
        // Not currently listening, safe to start
        recognitionRef.current.start();
        // State will be set by onstart handler
        return true;
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      return false;
    }
  }, [speechSupported, conversationMode]);

  // Store the function in a ref so it can be called from event handlers
  safeStartRecognitionRef.current = safeStartRecognition;

  const pauseConversation = useCallback(() => {
    if (conversationMode === "continuous") {
      setConversationMode("paused");
      continuousModeRef.current = false;
      setIsListening(false);
      isListeningRef.current = false;

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }

      // Clear simple restart interval when pausing
      if (simpleRestartRef.current) {
        clearInterval(simpleRestartRef.current);
        simpleRestartRef.current = null;
      }
    } else {
    }
  }, [conversationMode]);

  // Store the function in a ref so it can be called from event handlers
  pauseConversationRef.current = pauseConversation;

  // Simple speech recognition restart mechanism
  const startSimpleRestart = useCallback(() => {
    const restartInterval = setInterval(() => {
      if (
        continuousModeRef.current &&
        conversationMode === "continuous" &&
        !isListeningRef.current &&
        !isProcessingTranscriptRef.current &&
        !isSpeakingRef.current &&
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.start();
        } catch (error) {}
      }
    }, 3000); // Check every 3 seconds

    return restartInterval;
  }, [conversationMode]);

  // Store the function in a ref
  const simpleRestartRef = useRef(null);

  const resumeConversation = useCallback(() => {
    if (conversationMode === "paused") {
      setConversationMode("continuous");
      continuousModeRef.current = true;

      // Restart simple restart mechanism
      if (simpleRestartRef.current) {
        clearInterval(simpleRestartRef.current);
      }
      simpleRestartRef.current = startSimpleRestart();

      // Start listening directly without waiting for state update
      setTimeout(() => {
        if (recognitionRef.current && speechSupported) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
            isListeningRef.current = true;
            setVoiceState("listening");
          } catch (error) {
            console.error("🔧 Error starting speech recognition:", error);
          }
        } else {
        }
      }, 100);
    } else {
    }
  }, [conversationMode]);

  // Create tool registry with router function and conversation controls
  const toolRegistry = React.useMemo(() => {
    if (!navigate) return null;
    return createToolRegistry(
      navigate,
      wsConnectionRef.current,
      {
        stopConversation: stopContinuousConversation,
        pauseConversation: pauseConversation,
        resumeConversation: resumeConversation,
      },
      setConversationMode
    );
  }, [
    navigate,
    stopContinuousConversation,
    pauseConversation,
    resumeConversation,
    setConversationMode,
  ]);

  // Enhanced Speech Synthesis Functions with interruption support
  const speakText = useCallback(
    (text) => {
      if (!speechSupported || !synthesisRef.current || !autoSpeak) {
        return;
      }

      // Stop any current speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings for female-sounding voice
      utterance.rate = 1.5;
      utterance.pitch = 1.4; // Higher pitch for more female-sounding voice
      utterance.volume = 1.0; // Maximum volume

      // Try to select a female voice
      const voices = synthesisRef.current.getVoices();

      // First try to find explicitly female voices
      let preferredVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("victoria") ||
            voice.name.toLowerCase().includes("zira") ||
            voice.name.toLowerCase().includes("hazel") ||
            voice.name.toLowerCase().includes("ava") ||
            voice.name.toLowerCase().includes("allison"))
      );

      // If no female voice found, try to avoid male voices
      if (!preferredVoice) {
        preferredVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            !voice.name.toLowerCase().includes("male") &&
            !voice.name.toLowerCase().includes("man") &&
            !voice.name.toLowerCase().includes("alex") &&
            !voice.name.toLowerCase().includes("david") &&
            !voice.name.toLowerCase().includes("daniel") &&
            !voice.name.toLowerCase().includes("mark")
        );
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Clear previous speaking transcript and set new one
      setSpeakingTranscript("");

      // Simulate word-by-word display during speech
      const words = text.split(" ");
      let currentWordIndex = 0;

      const displayWords = () => {
        if (currentWordIndex < words.length && isSpeakingRef.current) {
          currentWordIndex++;

          // Cumulative transcript: append words from the start up to current
          const currentWords = words.slice(0, currentWordIndex);
          setSpeakingTranscript(currentWords.join(" "));

          // Auto-scroll to bottom to show newest words
          setTimeout(() => {
            const transcriptElement = document.querySelector(
              ".speaking-transcript"
            );
            if (transcriptElement) {
              transcriptElement.scrollTop = transcriptElement.scrollHeight;
            }
          }, 10);

          // Calculate delay based on speech rate and word length
          const baseDelay = 300; // Base delay per word in ms
          const rateMultiplier = 1 / utterance.rate; // Slower rate = longer delay
          const wordLength = words[currentWordIndex - 1]?.length || 1;
          const lengthMultiplier = Math.max(0.5, Math.min(2, wordLength / 5)); // Adjust for word length

          const wordDelay = Math.max(
            200,
            baseDelay * rateMultiplier * lengthMultiplier
          );
          setTimeout(displayWords, wordDelay);
        }
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
        setVoiceState("speaking");
        setIsInterrupted(false);

        // Start displaying words after a small delay to sync with actual speech
        setTimeout(() => {
          if (isSpeakingRef.current) {
            displayWords();
          }
        }, 200);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        currentUtteranceRef.current = null;

        // Clear speaking transcript after a short delay
        setTimeout(() => {
          setSpeakingTranscript("");
        }, 500);

        // In continuous mode, restart listening after speaking
        if (
          continuousModeRef.current &&
          conversationMode === "continuous" &&
          hasWelcomed
        ) {
          // Don't set ready state - go straight to listening to avoid flicker
          setTimeout(() => {
            if (
              continuousModeRef.current &&
              !isProcessingTranscriptRef.current
            ) {
              // Start listening immediately
              if (safeStartRecognitionRef.current) {
                safeStartRecognitionRef.current();
              }
            }
          }, 200);
        } else {
          setVoiceState("idle");
        }
      };

      utterance.onerror = (event) => {
        console.error("🔊 Speech synthesis error:", event.error);
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setVoiceState("idle");
        currentUtteranceRef.current = null;
        setSpeakingTranscript("");
      };

      currentUtteranceRef.current = utterance;
      synthesisRef.current.speak(utterance);
    },
    [speechSupported, autoSpeak, conversationMode, hasWelcomed]
  );

  // Store the function in a ref so it can be called from event handlers
  speakTextRef.current = speakText;

  // New conversation flow functions

  const speakWelcomeMessage = useCallback(() => {
    const welcomeMessage =
      "Hello! I'm your AI assistant here to help you to interact with our website. How can I help you today?";

    // Don't add welcome message to conversation history since it's already in the initial state
    // Just speak the welcome message with custom onend callback
    if (speechSupported && synthesisRef.current && autoSpeak) {
      // Stop any current speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(welcomeMessage);
      utterance.rate = 1.5;
      utterance.pitch = 1.4;
      utterance.volume = 1.0; // Maximum volume

      // Try to select a female voice
      const voices = synthesisRef.current.getVoices();

      // First try to find explicitly female voices
      let preferredVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("victoria") ||
            voice.name.toLowerCase().includes("zira") ||
            voice.name.toLowerCase().includes("hazel") ||
            voice.name.toLowerCase().includes("ava") ||
            voice.name.toLowerCase().includes("allison"))
      );

      // If no female voice found, try to avoid male voices
      if (!preferredVoice) {
        preferredVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            !voice.name.toLowerCase().includes("male") &&
            !voice.name.toLowerCase().includes("man") &&
            !voice.name.toLowerCase().includes("alex") &&
            !voice.name.toLowerCase().includes("david") &&
            !voice.name.toLowerCase().includes("daniel") &&
            !voice.name.toLowerCase().includes("mark")
        );
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Clear previous speaking transcript and set new one
      setSpeakingTranscript("");

      // Simulate word-by-word display during welcome message
      const words = welcomeMessage.split(" ");
      let currentWordIndex = 0;

      const displayWords = () => {
        if (currentWordIndex < words.length && isSpeakingRef.current) {
          currentWordIndex++;

          // Cumulative transcript: append words from the start up to current
          const currentWords = words.slice(0, currentWordIndex);
          setSpeakingTranscript(currentWords.join(" "));

          // Auto-scroll to bottom to show newest words
          setTimeout(() => {
            const transcriptElement = document.querySelector(
              ".speaking-transcript"
            );
            if (transcriptElement) {
              transcriptElement.scrollTop = transcriptElement.scrollHeight;
            }
          }, 10);

          // Calculate delay based on speech rate and word length
          const baseDelay = 300; // Base delay per word in ms
          const rateMultiplier = 1 / utterance.rate; // Slower rate = longer delay
          const wordLength = words[currentWordIndex - 1]?.length || 1;
          const lengthMultiplier = Math.max(0.5, Math.min(2, wordLength / 5)); // Adjust for word length

          const wordDelay = Math.max(
            200,
            baseDelay * rateMultiplier * lengthMultiplier
          );
          setTimeout(displayWords, wordDelay);
        }
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
        setVoiceState("speaking");

        // Start displaying words after a small delay to sync with actual speech
        setTimeout(() => {
          if (isSpeakingRef.current) {
            displayWords();
          }
        }, 200);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setHasWelcomed(true);

        // Clear speaking transcript after a short delay
        setTimeout(() => {
          setSpeakingTranscript("");
        }, 500);

        // Don't set ready state - go straight to listening

        // Start recognition after welcome message ends
        setTimeout(() => {
          if (safeStartRecognitionRef.current) {
            safeStartRecognitionRef.current();
          }
        }, 200);
      };

      utterance.onerror = (event) => {
        console.error("🔊 Welcome message error:", event.error);
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setVoiceState("idle");
        setHasWelcomed(true);
        setSpeakingTranscript("");
      };

      currentUtteranceRef.current = utterance;
      synthesisRef.current.speak(utterance);
    } else {
      // If speech not supported, just set hasWelcomed to true
      setHasWelcomed(true);
    }
  }, [speechSupported, autoSpeak]);

  const startPhoneCallMode = useCallback(async () => {
    // Clear any previous errors
    setSpeechError(null);

    setConversationMode("continuous");
    setIsInConversation(true);
    continuousModeRef.current = true;
    setSpeechError(null);
    setHasWelcomed(false); // Reset welcome state

    // Auto-minimize the bot when voice mode starts
    setIsOpen(false);

    // Start simple restart mechanism
    if (simpleRestartRef.current) {
      clearInterval(simpleRestartRef.current);
    }
    simpleRestartRef.current = startSimpleRestart();

    // Speak welcome message first
    speakWelcomeMessage();
  }, [speakWelcomeMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Initialize Speech APIs
  useEffect(() => {
    const initializeSpeechAPIs = () => {
      // Check for Speech Recognition support
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechSynthesis = window.speechSynthesis;

      if (SpeechRecognition && SpeechSynthesis) {
        setSpeechSupported(true);

        // Initialize Speech Recognition for continuous mode
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Enable continuous recognition
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        // Speech Recognition event handlers
        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true; // Update ref as well
          setVoiceState("listening");
          setIsWaitingForSpeech(true);
          setSpeechError(null);
          setCurrentTranscript(""); // Clear previous transcript when starting
        };

        recognition.onresult = (event) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Update current transcript for display
          setCurrentTranscript(finalTranscript || interimTranscript);

          // Process final transcript with 1 second delay
          if (finalTranscript && finalTranscript.trim()) {
            // Process transcript directly to avoid closure issues
            const transcript = finalTranscript.trim();
            if (
              !isProcessingTranscriptRef.current &&
              lastProcessedTranscriptRef.current !== transcript
            ) {
              isProcessingTranscriptRef.current = true;
              lastProcessedTranscriptRef.current = transcript;

              // Stop listening while processing
              recognition.stop();
              setCurrentTranscript("");
              setVoiceState("processing");

              // Wait 1 second before processing to allow user to continue speaking
              setTimeout(() => {
                if (handleMessageRef.current) {
                  handleMessageRef.current(transcript);
                }
              }, 1000);
            }
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          isListeningRef.current = false;
          setIsWaitingForSpeech(false);

          // Clear current transcript
          setCurrentTranscript("");

          // Auto-restart recognition in continuous mode if not processing or speaking

          if (
            continuousModeRef.current &&
            !isProcessingTranscriptRef.current &&
            !isSpeakingRef.current
          ) {
            // Clear any existing reconnect timeout
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }

            reconnectTimeoutRef.current = setTimeout(() => {
              if (
                continuousModeRef.current &&
                !isProcessingTranscriptRef.current &&
                !isSpeakingRef.current
              ) {
                try {
                  recognitionRef.current.start();
                } catch (error) {}
              } else {
              }
            }, VAD_CONFIG.RECONNECT_DELAY);
          } else {
          }
        };

        recognition.onerror = (event) => {
          setIsListening(false);
          isListeningRef.current = false;
          setCurrentTranscript("");

          // Handle no-speech as a normal event, not an error
          if (event.error === "no-speech") {
            if (
              continuousModeRef.current &&
              conversationMode === "continuous"
            ) {
              // Clear any existing reconnect timeout
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
              }

              reconnectTimeoutRef.current = setTimeout(() => {
                if (
                  continuousModeRef.current &&
                  conversationMode === "continuous" &&
                  safeStartRecognitionRef.current
                ) {
                  safeStartRecognitionRef.current();
                }
              }, VAD_CONFIG.RECONNECT_DELAY);
            }
            return; // Don't set error message for no-speech
          }

          // Handle actual errors
          let errorMessage = "Speech recognition error";
          switch (event.error) {
            case "audio-capture":
              errorMessage = "Microphone not found or access denied.";
              break;
            case "not-allowed":
              errorMessage = "Microphone permission denied.";
              break;
            case "network":
              errorMessage = "Network error occurred.";
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }

          console.error("🎤 Speech recognition error:", event.error);
          setSpeechError(errorMessage);

          // For other errors, try to reconnect in continuous mode
          if (
            continuousModeRef.current &&
            conversationMode === "continuous" &&
            hasWelcomed
          ) {
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }

            reconnectTimeoutRef.current = setTimeout(() => {
              if (
                continuousModeRef.current &&
                conversationMode === "continuous" &&
                hasWelcomed &&
                safeStartRecognitionRef.current
              ) {
                safeStartRecognitionRef.current();
              }
            }, VAD_CONFIG.RECONNECT_DELAY);
          }
        };

        recognitionRef.current = recognition;

        // Initialize Speech Synthesis
        synthesisRef.current = SpeechSynthesis;

        // Load voices if they're not already loaded
        const loadVoices = () => {
          const voices = SpeechSynthesis.getVoices();
          if (voices.length > 0) {
          }
        };

        // Load voices immediately if available
        loadVoices();

        // Load voices when they become available (some browsers load them asynchronously)
        SpeechSynthesis.addEventListener("voiceschanged", loadVoices);
      } else {
        console.warn("⚠️ Speech APIs not supported in this browser");
        setSpeechSupported(false);
        setSpeechError(
          "Speech recognition and synthesis are not supported in this browser."
        );
      }
    };

    initializeSpeechAPIs();

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (currentUtteranceRef.current) {
        synthesisRef.current?.cancel();
      }
    };
  }, []);

  // Tool queue processing function
  const processToolQueue = async () => {
    if (isProcessingRef.current || toolQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    setIsProcessingQueue(true);
    while (toolQueueRef.current.length > 0) {
      const toolCall = toolQueueRef.current.shift();

      try {
        await executeToolCall(toolCall);

        // Add a small delay between tool executions to ensure DOM updates
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`❌ Tool ${toolCall.tool} failed:`, error);
        // Continue with next tool even if one fails
      }
    }

    isProcessingRef.current = false;
    setIsProcessingQueue(false);
  };

  // Add tool to queue
  const addToolToQueue = (toolCall) => {
    toolQueueRef.current.push(toolCall);

    // Start processing if not already processing
    if (!isProcessingRef.current) {
      processToolQueue();
    }
  };

  // WebSocket connection management
  const connectWebSocketRef = useRef(null);
  const isConnectingRef = useRef(false);
  const connectionAttemptsRef = useRef(0);
  const connectionTimeoutRef = useRef(null);

  // Create stable connection function
  const connectWebSocket = useCallback(() => {
    // Prevent multiple connection attempts
    if (
      isConnectingRef.current ||
      (wsConnectionRef.current &&
        wsConnectionRef.current.readyState === WebSocket.CONNECTING) ||
      (wsConnectionRef.current &&
        wsConnectionRef.current.readyState === WebSocket.OPEN)
    ) {
      console.log(
        "WebSocket connection already exists or in progress, skipping..."
      );
      return;
    }

    // Close existing connection if any
    if (wsConnectionRef.current) {
      wsConnectionRef.current.close();
      wsConnectionRef.current = null;
    }

    try {
      isConnectingRef.current = true;
      connectionAttemptsRef.current += 1;
      setIsConnected(false);

      // Clear any existing connection timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      const ws = new WebSocket(`${WS_URL}?client_id=${clientId}`);
      wsConnectionRef.current = ws;

      // Set connection timeout (10 seconds)
      connectionTimeoutRef.current = setTimeout(() => {
        if (
          wsConnectionRef.current &&
          wsConnectionRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsConnectionRef.current.close();
          wsConnectionRef.current = null;
        }
        isConnectingRef.current = false;
      }, 10000);

      ws.onopen = () => {
        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }

        setWsConnection(ws);
        setIsConnected(true);
        isConnectingRef.current = false;
        connectionAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.tool && message.args) {
            // Add tool to queue for sequential execution
            addToolToQueue({
              tool: message.tool,
              args: message.args,
            });
          } else if (message.tool) {
            // Add tool to queue for sequential execution
            addToolToQueue({
              tool: message.tool,
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }

        setWsConnection(null);
        setIsConnected(false);
        isConnectingRef.current = false;

        // Only attempt reconnection if it wasn't a manual close and we're not already reconnecting
        if (
          event.code !== 1000 &&
          event.code !== 1001 &&
          !reconnectTimeoutRef.current
        ) {
          // Use exponential backoff with minimum delay
          const delay = Math.min(
            1000 * Math.pow(2, connectionAttemptsRef.current),
            30000
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            // Clear the timeout reference
            reconnectTimeoutRef.current = null;
            // Only reconnect if we're still disconnected and not already connecting
            if (!isConnected && !isConnectingRef.current) {
              connectWebSocket();
            }
          }, delay);
        }
      };

      ws.onerror = (error) => {
        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }

        setIsConnected(false);
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setIsConnected(false);
      isConnectingRef.current = false;
    }
  }, [clientId]); // Only depend on clientId

  // Store the function in ref to avoid dependency issues
  connectWebSocketRef.current = connectWebSocket;

  // Initialize WebSocket connection
  useEffect(() => {
    // Add a small delay to ensure component is fully mounted and server is ready
    const initTimeout = setTimeout(() => {
      connectWebSocket();
    }, 100);

    return () => {
      // Clear initialization timeout
      clearTimeout(initTimeout);

      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      if (wsConnectionRef.current) {
        wsConnectionRef.current.close();
        wsConnectionRef.current = null;
      }
    };
  }, [clientId]); // Only re-run when clientId changes

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setCurrentTranscript(""); // Clear speech transcript when sending message
    setIsTyping(true);
    const currentLocation = window.location.pathname;

    try {
      // Call the agent API
      const response = await fetch(AGENT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: currentLocation,
          query: currentInput,
          client_id: memoryEnabled ? clientId : null, // Only send client_id if memory is enabled
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const agentResponse = await response.json();

      // Validate the response format
      if (!agentResponse.content) {
        throw new Error("Invalid response format: missing content");
      }

      // Create AI message with the content from the agent response
      const aiResponse = {
        id: messages.length + 2,
        text: agentResponse.content,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsConnected(true);

      // Automatically speak the AI response
      if (autoSpeak && agentResponse.content) {
        setTimeout(() => {
          if (speakTextRef.current) {
            speakTextRef.current(agentResponse.content);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error calling agent API:", error);
      setIsConnected(false);

      // Fallback to local response if API fails
      const fallbackResponse = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later or contact support.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackResponse]);

      // Automatically speak the fallback response
      if (autoSpeak) {
        setTimeout(() => {
          if (speakTextRef.current) {
            speakTextRef.current(fallbackResponse.text);
          }
        }, 500);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Tool Executor
  const executeToolCall = async (toolCall) => {
    if (!(toolCall.tool in toolRegistry)) {
      throw new Error(`Unknown tool: ${toolCall.tool}`);
    }

    try {
      const result = await toolRegistry[toolCall.tool](toolCall.args);
      return result;
    } catch (error) {
      console.error(`❌ Error executing tool ${toolCall.tool}:`, error);
      throw error;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const toggleInterfaceMode = () => {
    setInterfaceMode(interfaceMode === "voice" ? "chat" : "voice");
  };

  // Speech Recognition Functions
  const startListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError("Speech recognition not available");
      return;
    }

    try {
      setSpeechError(null);
      setCurrentTranscript(""); // Clear previous transcript when starting new recognition
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setSpeechError("Failed to start speech recognition");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      isListeningRef.current = false;
    }
  };

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      currentUtteranceRef.current = null;
    }
  }, []);

  const toggleAutoSpeak = () => {
    setAutoSpeak(!autoSpeak);
    if (!autoSpeak && isSpeaking) {
      stopSpeaking();
    }
  };

  // Clear speech error after a delay
  useEffect(() => {
    if (speechError) {
      const timer = setTimeout(() => {
        setSpeechError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [speechError]);

  // Handle page visibility changes to pause/resume speech
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSpeaking) {
        // Pause speech when page becomes hidden
        if (synthesisRef.current) {
          synthesisRef.current.pause();
        }
      } else if (!document.hidden && isSpeaking) {
        // Resume speech when page becomes visible
        if (synthesisRef.current) {
          synthesisRef.current.resume();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSpeaking]);

  // Handle browser tab focus/blur for speech recognition
  useEffect(() => {
    const handleFocus = () => {
      // Browser regained focus - speech recognition might need restart
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (error) {
          console.warn("Error restarting speech recognition on focus:", error);
        }
      }
    };

    const handleBlur = () => {
      // Browser lost focus - stop speech recognition to save resources
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn("Error stopping speech recognition on blur:", error);
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div className="chatbot-container">
      {/* ElevenLabs-Style Voice Interface */}
      {isOpen && (
        <div className="voice-interface">
          {/* Header with minimal controls */}
          <div className="voice-header">
            <div className="connection-status">
              <div
                className={`status-indicator ${
                  isConnected ? "connected" : "disconnected"
                }`}
              ></div>
              <span className="status-text">
                {isConnected ? "Connected" : "Offline"}
              </span>
            </div>

            <div className="header-controls">
              <button
                className={`setting-btn ${autoSpeak ? "active" : ""}`}
                onClick={toggleAutoSpeak}
                title={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </button>

              <button
                className="interface-toggle"
                onClick={toggleInterfaceMode}
                title={
                  interfaceMode === "voice"
                    ? "Switch to chat"
                    : "Switch to voice"
                }
              >
                {interfaceMode === "voice" ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                  </svg>
                )}
              </button>

              <button className="close-button" onClick={toggleChatbot}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Interface - Voice or Chat */}
          <div className="voice-main">
            {interfaceMode === "voice" ? (
              /* Voice Interface */
              <div className="voice-interface-content">
                {/* Large Voice Animation */}
                <div className="voice-animation-container">
                  <div
                    className={`voice-animation ${
                      conversationMode === "paused" ? "paused" : voiceState
                    }`}
                  >
                    <div className="voice-circle">
                      <div className="voice-icon">
                        {conversationMode === "paused" ? (
                          <svg
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : voiceState === "listening" ? (
                          <svg
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                          </svg>
                        ) : voiceState === "speaking" ? (
                          <svg
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                          </svg>
                        ) : voiceState === "processing" ? (
                          <svg
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                          </svg>
                        ) : voiceState === "ready" ? (
                          <svg
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="12" cy="12" r="2" opacity="0.8" />
                            <circle
                              cx="12"
                              cy="12"
                              r="5"
                              opacity="0.4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="8"
                              opacity="0.2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Voice Level Waveform */}
                      {voiceState === "listening" && (
                        <div className="voice-waveform">
                          {Array.from({ length: 8 }, (_, i) => (
                            <div
                              key={i}
                              className="wave-bar"
                              style={{
                                "--delay": `${i * 0.1}s`,
                                "--height": `${30 + (i % 2) * 20}px`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Text */}
                <div className="voice-status">
                  {conversationMode === "continuous" && isInConversation ? (
                    <>
                      {voiceState === "listening" && (
                        <span className="status-text">Listening...</span>
                      )}
                      {voiceState === "speaking" && (
                        <span className="status-text">Speaking...</span>
                      )}
                      {voiceState === "processing" && (
                        <span className="status-text">Processing...</span>
                      )}
                      {conversationMode === "paused" && (
                        <span className="status-text">Call Paused</span>
                      )}
                      {voiceState === "ready" && (
                        <span className="status-text">Ready to talk</span>
                      )}
                    </>
                  ) : (
                    <span className="status-text">
                      {speechSupported
                        ? "Voice assistant ready"
                        : "Voice not supported"}
                    </span>
                  )}
                </div>

                {/* Current Transcript - Listening */}
                {currentTranscript && voiceState === "listening" && (
                  <div className="current-transcript">
                    <p>{currentTranscript}</p>
                  </div>
                )}

                {/* Speaking Transcript - Speaking */}
                {speakingTranscript && voiceState === "speaking" && (
                  <div className="speaking-transcript">
                    <p>{speakingTranscript}</p>
                  </div>
                )}

                {/* Error Display */}
                {speechError && (
                  <div className="voice-error">
                    <div className="error-content">
                      <p>⚠️ {speechError}</p>
                      {speechError.includes("already in use") && (
                        <button
                          className="retry-btn"
                          onClick={startPhoneCallMode}
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Conversation Controls */}
                <div className="conversation-controls">
                  {conversationMode === "manual" && (
                    <button
                      className="start-conversation-btn"
                      onClick={startPhoneCallMode}
                      disabled={!speechSupported}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                      </svg>
                      Start Conversation
                    </button>
                  )}

                  {conversationMode === "continuous" && (
                    <div className="continuous-controls">
                      <button
                        className="pause-conversation-btn"
                        onClick={pauseConversation}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                        Pause
                      </button>

                      <button
                        className="end-conversation-btn"
                        onClick={stopContinuousConversation}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                        </svg>
                        End Call
                      </button>
                    </div>
                  )}

                  {conversationMode === "paused" && (
                    <button
                      className="resume-conversation-btn"
                      onClick={resumeConversation}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Resume
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Chat Interface */
              <div className="chat-interface">
                {/* Chat Messages */}
                <div className="chat-messages">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-message ${
                        message.sender === "user" ? "user" : "ai"
                      }`}
                    >
                      <div className="message-content">
                        <p>{message.text}</p>
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="chat-message ai typing">
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to Bottom Button */}
                {/* <button
                  className="scroll-to-bottom-btn"
                  onClick={scrollToBottom}
                  title="Scroll to bottom"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </button> */}

                {/* Chat Input */}
                <div className="chat-input-container">
                  <div className="chat-input-wrapper">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="chat-input"
                      rows="1"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="send-button"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ElevenLabs-Style Floating Button */}
      <div className="floating-buttons">
        {isInConversation &&
        (conversationMode === "continuous" || conversationMode === "paused") &&
        !isOpen ? (
          /* Call Controls - Three Button Layout (only when interface is closed) */
          <div className="call-controls">
            {/* Logo/Avatar Button */}
            <button
              className="call-control-btn logo-btn"
              // onClick={toggleChatbot}
            >
              <Headset className="h-5 w-5 text-white" />
              {/* Voice State Overlay */}
              <div className={`voice-state-overlay ${voiceState}`}>
                {voiceState === "listening" && (
                  <div className="listening-indicator">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay-1"></div>
                    <div className="pulse-ring delay-2"></div>
                  </div>
                )}
                {voiceState === "speaking" && (
                  <div className="speaking-indicator">
                    <div className="speaking-rings">
                      <div className="speaking-ring"></div>
                      <div className="speaking-ring delay-1"></div>
                      <div className="speaking-ring delay-2"></div>
                    </div>
                    <div className="sound-wave">
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                    </div>
                  </div>
                )}
                {voiceState === "processing" && (
                  <div className="processing-indicator">
                    <div className="processing-spinner"></div>
                    <div className="processing-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                )}
              </div>
            </button>

            {/* End Call / Resume Call Button */}
            {conversationMode === "paused" ? (
              <button
                className="call-control-btn resume-call-btn"
                onClick={resumeConversation}
                title="Resume Call"
              >
                <Play style={{ width: "20px", height: "20px" }} />
              </button>
            ) : (
              <button
                className="call-control-btn end-call-btn"
                onClick={stopContinuousConversation}
                title="End Call"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  <path
                    d="M22 2l-20 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}

            {/* Expand/Maximize Button */}
            <button
              className="call-control-btn expand-btn"
              // onClick={toggleInterfaceMode}
              onClick={toggleChatbot}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="">
            <button
              className={`chatbot-toggle ${isOpen ? "minimize-mode" : ""}`}
              onClick={toggleChatbot}
            >
              {isOpen ? (
                /* Minimize Button - Clean Circular Design */
                <div className="minimize-button">
                  <div className="minimize-inner-circle">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </div>
                </div>
              ) : (
                /* Start Call Button - ElevenLabs Style */
                <>
                  {/* Circular Logo/Avatar Area */}
                  <div className="chatbot-avatar">
                    <Headset className="h-5 w-5 text-white" />
                  </div>

                  {/* Black Button Area */}
                  <div className="chatbot-button-area">
                    <div className="phone-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <span>Start a call</span>
                  </div>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
