class FileBrowser {
    constructor() {
        this.currentPath = '';
        this.initElements();
        this.bindEvents();
        this.loadFiles('');
    }

    initElements() {
        this.fileList = document.getElementById('file-list');
        this.breadcrumbs = document.getElementById('breadcrumbs');
        this.viewerOverlay = document.getElementById('viewer-overlay');
        this.viewerContainer = document.getElementById('viewer-container');
        this.viewerTitle = document.getElementById('viewer-title');
        this.fileContent = document.getElementById('file-content');
        this.closeBtn = document.querySelector('.close-btn');
    }

    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.closeViewer());
        this.viewerOverlay.addEventListener('click', () => this.closeViewer());
        window.addEventListener('popstate', () => this.handleHistory());
    }

    async loadFiles(path) {
        try {
            this.currentPath = path || '';
            const response = await fetch(`/api/list?path=${encodeURIComponent(this.currentPath)}`);
            const files = await response.json();

            this.renderFiles(files);
            this.updateBreadcrumbs();

            const newHash = this.currentPath ? `#${this.currentPath}` : '#';
            if (window.location.hash !== newHash) {
                history.pushState({}, '', newHash);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    renderFiles(files) {
        this.fileList.innerHTML = files.map(file => `
            <div class="file-item">
                <div class="file-info">
                    <span class="file-icon">${file.type === 'dir' ? '📁' : '📄'}</span>
                    <span class="file-name ${file.type === 'dir' ? 'dir' : ''}">${file.name}</span>
                    <span class="file-date">${this.formatDate(file.mtime)}</span>
                </div>
                <div class="file-actions">
                    <span class="file-size">${this.formatSize(file.size)}</span>
                    <button class="download-btn">Download</button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.file-item').forEach((item, index) => {
            const file = files[index];
            const btn = item.querySelector('.download-btn');

            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('download-btn')) {
                    file.type === 'dir' ?
                        this.navigateTo(file.name) :
                        this.showFile(file.name);
                }
            });

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.downloadFile(file);
            });
        });
    }

    async showFile(filename) {
        try {
            document.querySelector('.container').style.filter = 'blur(2px)';
            const response = await fetch(`/api/view?path=${encodeURIComponent(`${this.currentPath}/${filename}`)}`);
            const content = await response.text();

            this.viewerTitle.textContent = filename;
            this.fileContent.textContent = content;
            this.viewerOverlay.style.display = 'block';
            this.viewerContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Error loading file:', error);
        }
    }

    closeViewer() {
        document.querySelector('.container').style.filter = '';
        this.viewerOverlay.style.display = 'none';
        this.viewerContainer.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    navigateTo(dir) {
        this.currentPath = this.currentPath ?
            `${this.currentPath}/${dir}` :
            dir;
        this.loadFiles(this.currentPath);
    }

    downloadFile(file) {
        const link = document.createElement('a');
        link.href = `/api/download?path=${encodeURIComponent(`${this.currentPath}/${file.name}`)}`;
        link.download = file.name + (file.type === 'dir' ? '.zip' : '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    updateBreadcrumbs() {
        const parts = this.currentPath.split('/').filter(p => p);
        this.breadcrumbs.innerHTML = '';

        // Home button
        const home = document.createElement('div');
        home.className = 'breadcrumb breadcrumb-home';
        home.innerHTML = 'Home';
        home.addEventListener('click', () => {
            history.pushState({}, '', '#');
            this.loadFiles('');
        });
        this.breadcrumbs.appendChild(home);

        // Dynamic path parts
        let accumulatedPath = '';
        parts.forEach((part, index) => {
            const sep = document.createElement('span');
            sep.className = 'breadcrumb-separator';
            sep.textContent = '/';
            this.breadcrumbs.appendChild(sep);

            const crumb = document.createElement('div');
            crumb.className = 'breadcrumb';
            crumb.textContent = part;

            accumulatedPath += (accumulatedPath ? '/' : '') + part;
            const targetPath = accumulatedPath;

            crumb.addEventListener('click', () => {
                history.pushState({}, '', `#${targetPath}`);
                this.loadFiles(targetPath);
            });

            this.breadcrumbs.appendChild(crumb);
        });
    }

    formatSize(bytes) {
        if (bytes === 0 || bytes === undefined) return '-';
        const units = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / (1024 ** i)).toFixed(1)} ${units[i]}`;
    }

    formatDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    handleHistory() {
        const hash = window.location.hash.slice(1);
        this.currentPath = hash;
        this.loadFiles(hash);
    }
}

window.onload = () => new FileBrowser();