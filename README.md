# **DaaS** (Directory-as-a-Service)

**DaaS** is a file browser written in JavaScript with a frontend in HTML, CSS, and JavaScript. Allows viewing files and folders, downloading them (including zipping), and viewing media files directly in the browser.

## Screenshots
![image](https://github.com/user-attachments/assets/18260f24-9128-4c18-a981-a67495e7b6df)

## Features

- View files and folders
- Download files and folders (zipping)
- View text files
- Modern, user-friendly, and animated interface
- Easy customization via API

## Project Structure
```project tree
daas
├── safe_share           # Main folder with files visible on the site
├── src                  # Frontend source code
│   ├── css
│   │   └── style.css    # Main stylesheet
│   ├── assets/images
│   │   └── icon.png     # Project icon
│   ├── js
│   │   └── script.js    # Frontend logic
│   └── index.html       # Main page
├── server.js            # Backend server in JavaScript
└── README.md            # This file
```

## Installation & Usage

### Requirements

- nodejs

### Starting the Server

1. Clone the repository:
   ```sh
   git clone https://github.com/Aph0nic/daas.git
   cd daas

   # installing dependencies
   npm install express archiver cors
   ```
2. Run the server:
   ```sh
   node server.js
   ```
3. Open `http://localhost:8080` in your browser.

## Configuration

- The root folder path is set in `server.js` (variable `rootDir`)
- The API allows extending functionality and adding support for new file types

## License

Distributed under the MIT License.

## Author

Developer: **Aph0nic**

![СВАГА_](https://github.com/user-attachments/assets/0215f2fe-d3cc-43ea-a942-38cc97a75bdc)
