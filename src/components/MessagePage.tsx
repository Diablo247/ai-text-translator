import React, { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const MessagePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("fr");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  // Handle input field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    handleDetectLanguage();
    handleSummarize();
    handleTranslate();
  };

  // Function to translate text
  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      if (!("ai" in self) || !("translator" in self.ai)) {
        throw new Error("Translator API is not supported in this browser.");
      }

      const translator = await self.ai.translator.create({
        sourceLanguage, // Use detected language or default to English
        targetLanguage, // Change to your desired target language
      });

      const result = await translator.translate(inputText);
      setTranslatedText(result);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to detect language
  const handleDetectLanguage = async () => {
    if (!translatedText.trim()) return;

    setIsLoading(true);
    try {
      if (!("ai" in self) || !("languageDetector" in self.ai)) {
        throw new Error(
          "Language Detection API is not supported in this browser."
        );
      }

      const detector = await self.ai.languageDetector.create();
      const result = await detector.detect(translatedText);
      if (result.length > 0) {
        setDetectedLanguage(result[0].detectedLanguage);
      } else {
        setDetectedLanguage("Unknown");
      }
    } catch (error) {
      console.error("Language detection failed:", error);
      setDetectedLanguage("Detection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to summarize text
  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      if (!("ai" in self) || !("summarizer" in self.ai)) {
        throw new Error("Summarizer API is not supported in this browser.");
      }

      const summarizer = await self.ai.summarizer.create({
        sharedContext: "This is a general context for summarization.",
        type: "key-points",
        format: "markdown",
        length: "short",
      });

      const summaryResult = await summarizer.summarize(inputText);
      setSummary(summaryResult);
    } catch (error) {
      console.error("Summarization failed:", error);
      setSummary("Summarization failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummary = () => {
    if (inputText.trim() === "") return; // Prevent sending empty messages

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulating a bot reply after the message is sent
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: `Bot response to: ${summary}`,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);
      setIsLoading(false);
    }, 1500); // Simulate a delay for bot reply
  };

  // Handle sending the message
  const handleSendMessage = () => {
    if (inputText.trim() === "") return; // Prevent sending empty messages

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulating a bot reply after the message is sent
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: translatedText,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);
      setIsLoading(false);
    }, 1500); // Simulate a delay for bot reply
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col justify-between h-screen">
      <div className="flex-1 overflow-auto bg-gray-700 p-4 rounded-lg space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            Start the conversation!
          </p>
        ) : (
          messages.map((message) => (
            <div>
              {message.sender === "user" ? (
                <div
                  key={message.id}
                  className="p-4 rounded-[75px] max-w-[60%] bg-gradient-to-r from-orange-500 to-orange-800 text-white rounded-tl-none"
                >
                  <p>{message.text}</p>
                </div>
              ) : (
                <div className="p-4 rounded-[75px] max-w-[60%] bg-gray-100 text-black rounded-tr-none ml-auto">
                  <p>
                    {message.text}
                    <p className="text-[15px] text-gray-400">
                      {detectedLanguage}
                    </p>
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isLoading && (
        <div className="text-center text-gray-500 italic">Translating...</div>
      )}

      <div className="flex items-center space-x-4 mt-4">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full p-3 border border-gray-300 rounded-md resize-none"
        />

        <div>
          <div>
            <label className="flex justify-between items-center">
              FROM:
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="bg-blue-500 w-[100px] text-[15px] text-white px-6 py-3  my-2.5 rounded-md focus:outline-none hover:bg-blue-600"
              >
                <option value="en" selected>
                  English
                </option>
                <option value="es">Spanish</option>
                <option value="pt">Portuguese</option>
                <option value="ru"> Russian</option>
                <option value="tr">Turkish</option>
                <option value="fr">French</option>
              </select>
            </label>
          </div>
          <div>
            <label className="flex justify-between items-center">
              TO:
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-blue-500 w-[100px] text-[15px] text-white  my-2.5 px-6 py-3 rounded-md focus:outline-none hover:bg-blue-600"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="pt">Portuguese</option>
                <option value="ru"> Russian</option>
                <option value="tr">Turkish</option>
                <option value="fr" selected>
                  French
                </option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-6  my-2.5 py-3 rounded-md focus:outline-none hover:bg-blue-600"
          >
            Translate
          </button>
          <button
            onClick={handleSummary}
            className="bg-blue-500 text-white px-6  my-2.5 py-3 rounded-md focus:outline-none hover:bg-blue-600"
          >
            Summary
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default MessagePage;
