# **DaaS** (Directory-as-a-Service)

**DaaS** is a file browser written in JavaScript with a frontend in HTML, CSS, and JavaScript. Allows viewing files and folders, downloading them (including zipping), and viewing media files directly in the browser.

## Features

- View files and folders
- Download files and folders (zipping)
- View text files
- Modern, user-friendly, and animated interface
- Easy customization via API

## Project Structure
```project tree
daas
├── main                 # Main folder with files visible on the site
├── src                  # Frontend source code
│   ├── css
│   │   └── style.css    # Main stylesheet
│   ├── img
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
   git clone https://github.com/Azuremuzzlekit/daas.git
   cd daas
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

Developer: **Azuremuzzlekit**



# На русском (ru)
DaaS — это файловый браузер, написанный на JavaScript с фронтендом на HTML, CSS и JavaScript. Позволяет просматривать файлы и папки, скачивать их (включая архивацию в zip), а также просматривать медиафайлы прямо в браузере.

## Возможности

- Просмотр файлов и папок
- Скачивание файлов и папок (архивация в zip)
- Просмотр текстовых файлов
- Современный, удобный и анимированный интерфейс
- Простая модификация через API

## Структура проекта

```
daas
├── main                 # Основная папка с файлами, видными на сайте
├── src                  # Исходники фронтенда
│   ├── css
│   │   └── style.css    # Основной стиль
│   ├── img
│   │   └── icon.png     # Иконка проекта
│   ├── js
│   │   └── script.js    # Логика фронтенда
│   └── index.html       # Главная страница
├── server.js            # Серверная часть на JavaScript
└── README.md            # Этот файл
```

## Установка и запуск

### Требования

- nodejs

### Запуск сервера

1. Клонируйте репозиторий:
   ```sh
   git clone https://github.com/Azuremuzzlekit/daas.git
   cd daas
   ```
2. Запустите сервер:
   ```sh
   node server.js
   ```
3. Откройте в браузере `http://localhost:8080`

## Конфигурация

- Путь к основной папке устанавливается в коде `server.js` (переменная `rootDir`)
- API позволяет расширять функционал и добавлять поддержку новых типов файлов

## Лицензия

Проект распространяется под лицензией MIT.

## Автор

Разработчик: **Azuremuzzlekit**

