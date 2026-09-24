// All 35 Python projects data
const PROJECTS = [
    // ===== BEGINNER (1-10) =====
    { id: 1, title: "Calculator", description: "Basic math operations (+, -, ×, ÷)", level: "beginner", tags: ["input/output", "functions", "operators"] },
    { id: 2, title: "Number Guessing Game", description: "Computer picks a number, you guess", level: "beginner", tags: ["random", "while loops", "conditionals"] },
    { id: 3, title: "Rock Paper Scissors", description: "Play against the computer", level: "beginner", tags: ["random.choice()", "if/elif/else"] },
    { id: 4, title: "Mad Libs Generator", description: "Fill-in-the-blank word game", level: "beginner", tags: ["string formatting", "input()"] },
    { id: 5, title: "To-Do List (CLI)", description: "Add, remove, view tasks in terminal", level: "beginner", tags: ["lists", "loops", "file I/O"] },
    { id: 6, title: "Dice Roller", description: "Simulate rolling dice", level: "beginner", tags: ["random", "functions", "loops"] },
    { id: 7, title: "Simple Quiz App", description: "Multiple choice questions with scoring", level: "beginner", tags: ["dictionaries", "loops", "conditionals"] },
    { id: 8, title: "Countdown Timer", description: "Timer that counts down from N seconds", level: "beginner", tags: ["time.sleep()", "while loops"] },
    { id: 9, title: "Temperature Converter", description: "Celsius ↔ Fahrenheit ↔ Kelvin", level: "beginner", tags: ["functions", "math"] },
    { id: 10, title: "Password Generator", description: "Generate random secure passwords", level: "beginner", tags: ["random", "string module", "lists"] },

    // ===== INTERMEDIATE (11-20) =====
    { id: 11, title: "Contact Book", description: "Store, search, edit, delete contacts", level: "intermediate", tags: ["dictionaries", "JSON", "CRUD"] },
    { id: 12, title: "Hangman Game", description: "Classic word guessing game", level: "intermediate", tags: ["strings", "sets", "ASCII art"] },
    { id: 13, title: "Tic-Tac-Toe", description: "2-player or vs computer", level: "intermediate", tags: ["2D lists", "game logic"] },
    { id: 14, title: "Weather App", description: "Fetch real weather data from API", level: "intermediate", tags: ["requests", "API calls", "JSON"] },
    { id: 15, title: "Web Scraper", description: "Scrape data from a website", level: "intermediate", tags: ["BeautifulSoup", "requests", "parsing"] },
    { id: 16, title: "Expense Tracker", description: "Track spending with categories", level: "intermediate", tags: ["file I/O", "csv module", "dictionaries"] },
    { id: 17, title: "URL Shortener", description: "Shorten long URLs", level: "intermediate", tags: ["APIs", "requests", "strings"] },
    { id: 18, title: "Alarm Clock", description: "Set alarms with sound", level: "intermediate", tags: ["datetime", "time", "playsound"] },
    { id: 19, title: "Flashcard App", description: "Study with digital flashcards", level: "intermediate", tags: ["OOP", "file I/O", "random"] },
    { id: 20, title: "Snake Game", description: "Classic snake game", level: "intermediate", tags: ["pygame", "OOP", "game loops"] },

    // ===== ADVANCED (21-30) =====
    { id: 21, title: "Blog Website", description: "Full blog with posts, comments", level: "advanced", tags: ["Flask/Django", "HTML", "databases"] },
    { id: 22, title: "Chat Application", description: "Real-time messaging", level: "advanced", tags: ["socket", "threading", "networking"] },
    { id: 23, title: "File Organizer", description: "Auto-sort files by type", level: "advanced", tags: ["os", "shutil", "pathlib"] },
    { id: 24, title: "YouTube Downloader", description: "Download videos from YouTube", level: "advanced", tags: ["yt-dlp", "CLI", "file I/O"] },
    { id: 25, title: "REST API", description: "Build your own API", level: "advanced", tags: ["FastAPI", "JSON", "HTTP methods"] },
    { id: 26, title: "Twitter/X Bot", description: "Auto-post or reply on social media", level: "advanced", tags: ["APIs", "tweepy", "automation"] },
    { id: 27, title: "Data Dashboard", description: "Visualize data with charts", level: "advanced", tags: ["pandas", "matplotlib", "streamlit"] },
    { id: 28, title: "Face Detection", description: "Detect faces in images/webcam", level: "advanced", tags: ["OpenCV", "numpy", "computer vision"] },
    { id: 29, title: "AI Chatbot", description: "Chatbot using an LLM API", level: "advanced", tags: ["google-genai", "API calls"] },
    { id: 30, title: "E-commerce Store", description: "Full shop with cart & payments", level: "advanced", tags: ["Django", "databases", "Stripe API"] },

    // ===== EXPERT (31-35) =====
    { id: 31, title: "Task Automation Suite", description: "Automate emails, files, scraping", level: "expert", tags: ["schedule", "smtplib", "selenium"] },
    { id: 32, title: "Machine Learning Model", description: "Predict house prices, spam, etc.", level: "expert", tags: ["scikit-learn", "pandas", "ML"] },
    { id: 33, title: "Multiplayer Game Server", description: "Online game with multiple players", level: "expert", tags: ["asyncio", "WebSockets", "networking"] },
    { id: 34, title: "Personal Finance AI", description: "AI-powered budget advisor", level: "expert", tags: ["LLM APIs", "pandas", "data analysis"] },
    { id: 35, title: "Full-Stack SaaS App", description: "Complete web app with auth & payments", level: "expert", tags: ["Django/FastAPI", "React", "PostgreSQL"] },
];
