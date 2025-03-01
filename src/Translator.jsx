import React, { useState, useEffect } from "react";
import ClipboardJS from "clipboard";

const Translator = () => {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [selectedLang, setSelectedLang] = useState("ko");
    const [copySuccess, setCopySuccess] = useState(false);

    // ClipboardJS for copying translated text
    useEffect(() => {
        const clipboard = new ClipboardJS("#copyBtn", {
            text: () => translatedText,
        });

        clipboard.on("success", () => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 1000);
        });

        return () => clipboard.destroy();
    }, [translatedText]);

    // Handle input change and trigger translation
    const handleInputChange = (e) => {
        setInputText(e.target.value);
        fetchTranslation(e.target.value);
    };

    // Handle language selection change
    const handleLangChange = (e) => {
        setSelectedLang(e.target.value);
        fetchTranslation(inputText);
    };

    // Fetch translation from Google Translate API
    const fetchTranslation = async (text) => {
        if (!text.trim()) {
            setTranslatedText("");
            return;
        }

        const targetLang = "en";
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${selectedLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
            text
        )}`;

        setTranslatedText("Translating...");

        try {
            const response = await fetch(url);
            const data = await response.json();
            const translated = data[0].map((item) => item[0]).join("");
            setTranslatedText(translated);
        } catch (error) {
            setTranslatedText("Error fetching translation");
        }
    };

    // Paste text from clipboard
    const pasteText = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputText(text);
            fetchTranslation(text);
        } catch (err) {
            alert("Failed to read clipboard. Allow clipboard access.");
        }
    };

    // Clear text fields
    const clearInput = () => {
        setInputText("");
        setTranslatedText("");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
                Korean Translator
            </h2>

            {/* Language Selection */}
            <select
                value={selectedLang}
                onChange={handleLangChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
                <option value="ko">Korean</option>
            </select>

            {/* Input Text */}
            <textarea
                value={inputText}
                onChange={handleInputChange}
                className="w-full p-3 mt-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none h-32"
                placeholder="Type or paste text here..."
            ></textarea>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={pasteText}
                    className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-yellow-600 transition duration-200 shadow"
                >
                    Paste
                </button>
                {/* <button
                    onClick={clearInput}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 shadow"
                >
                    Clear
                </button> */}
                {/* <button
                    id="copyBtn"
                    className={`px-4 py-2 rounded-lg transition duration-200 shadow ${copySuccess
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    {copySuccess ? "Copied!" : "Copy"}
                </button> */}
            </div>

            {/* Translated Output */}
            <textarea
                value={translatedText}
                readOnly
                className="w-full p-3 mt-4 border rounded-lg bg-gray-100 cursor-not-allowed resize-none h-32"
                placeholder="Translated text..."
            ></textarea>
        </div>
    );
};

export default Translator;
