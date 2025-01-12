# MangaFinderAPI

MangaFinderAPI is a simple API to manage and serve manga files.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Picsou06/MangaFinderAPI.git
    cd MangaFinderAPI
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Setup

1. Configure the `.env` file with your database access information. Rename the `.env.exemple` file in the root directory to `.env` and update the following content:
    ```plaintext
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=yourusername
    DB_PASSWORD=yourpassword
    DB_NAME=yourdatabasename
    DB_TABLE=yourtablename
    WEBSITE=yourwebsite
    PORT=3000
    ```

## Manga Directory Structure

1. Place your manga files in the `mangas` directory.
2. Each manga should be placed in a folder named in the format: `manga_name - language` (e.g., `Naruto - en`).
3. Inside each manga folder, each chapter should be in its own subfolder.
4. Each manga folder should contain a `cover.jpg` image representing the cover of the manga.

Example structure:
```plaintext
mangas/
├── Naruto - en/
│   ├── cover.jpg
│   ├── Chapter 1/
│   │   ├── page1.jpg
│   │   ├── page2.jpg
│   ├── Chapter 2/
│   │   ├── page1.jpg
│   │   ├── page2.jpg
├── One Piece - fr/
│   ├── cover.jpg
│   ├── Chapter 1/
│   │   ├── page1.jpg
│   │   ├── page2.jpg
```

## Running the API

1. Start the API using the following command:
    ```sh
    node app.js
    ```

2. The API should now be running and accessible at the specified port.

Enjoy using MangaFinderAPI!
