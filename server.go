package main

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const (
	port    = 8080
	rootDir = "./main"
	webDir  = "./src"
)

type FileInfo struct {
	Name    string `json:"name"`
	Type    string `json:"type"`
	Size    int64  `json:"size"`
	ModTime int64  `json:"mtime"`
}

func main() {
	log.Printf("Server starting on port %d...\nhttp:/localhost:%d", port, port)
	http.HandleFunc("/", handleRequest)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	switch {
	case strings.HasPrefix(r.URL.Path, "/api/list"):
		handleList(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/download"):
		handleDownload(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/view"):
		handleView(w, r)
	default:
		serveStatic(w, r)
	}
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	if path == "/" {
		path = "/index.html"
	}
	http.ServeFile(w, r, filepath.Join(webDir, path))
}

func handleList(w http.ResponseWriter, r *http.Request) {
	queryPath := r.URL.Query().Get("path")
	fullPath := filepath.Join(rootDir, queryPath)

	if !isSafePath(fullPath) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	files, err := os.ReadDir(fullPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	response := make([]FileInfo, 0)
	for _, f := range files {
		if f.Name() == "." || f.Name() == ".." {
			continue
		}

		info, _ := f.Info()
		response = append(response, FileInfo{
			Name:    f.Name(),
			Type:    fileType(f),
			Size:    info.Size(),
			ModTime: info.ModTime().Unix(),
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleDownload(w http.ResponseWriter, r *http.Request) {
	queryPath := r.URL.Query().Get("path")
	fullPath := filepath.Join(rootDir, queryPath)

	if !isSafePath(fullPath) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	info, err := os.Stat(fullPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if info.IsDir() {
		archiveDir(w, fullPath)
	} else {
		w.Header().Set("Content-Disposition",
			fmt.Sprintf("attachment; filename=\"%s\"", filepath.Base(fullPath)))
		http.ServeFile(w, r, fullPath)
	}
}

func archiveDir(w http.ResponseWriter, dirPath string) {
	buf := new(bytes.Buffer)
	zipWriter := zip.NewWriter(buf)

	filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return nil
		}

		relPath, _ := filepath.Rel(dirPath, path)
		fileWriter, _ := zipWriter.Create(relPath)
		file, _ := os.Open(path)
		defer file.Close()
		io.Copy(fileWriter, file)
		return nil
	})

	zipWriter.Close()
	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition",
		fmt.Sprintf("attachment; filename=\"%s.zip\"", filepath.Base(dirPath)))
	w.Write(buf.Bytes())
}

func handleView(w http.ResponseWriter, r *http.Request) {
	queryPath := r.URL.Query().Get("path")
	fullPath := filepath.Join(rootDir, queryPath)

	if !isSafePath(fullPath) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	content, err := os.ReadFile(fullPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.Write(content)
}

func isSafePath(path string) bool {
	absPath, _ := filepath.Abs(path)
	absRoot, _ := filepath.Abs(rootDir)
	return strings.HasPrefix(absPath, absRoot)
}

func fileType(f os.DirEntry) string {
	if f.IsDir() {
		return "dir"
	}
	return "file"
}
