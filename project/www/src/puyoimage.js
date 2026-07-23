class PuyoImage {
    static initialize() {
        this.puyoImages = [];
        this.originalPuyoImages = []; // 保存
        for(let i = 0; i < 5; i++) {
            const image = document.getElementById(`puyo_${i + 1}`);
            image.removeAttribute('id');
            image.width = Config.puyoImgWidth;
            image.height = Config.puyoImgHeight;
            image.style.position = 'absolute';
            this.puyoImages[i] = image;
            this.originalPuyoImages[i] = image; // 保存しておく
        }

        // あえて既定ではシャッフルする（既存挙動を維持）
        for (let i = this.puyoImages.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.puyoImages[i], this.puyoImages[j]] = [this.puyoImages[j], this.puyoImages[i]];
        }

        this.batankyuImage = document.getElementById('batankyu');
        this.batankyuImage.width = Config.puyoImgWidth * 6;
        this.batankyuImage.style.position = 'absolute';

        // puzzle 用の色固定機能初期化
        this.usePuzzleColors = false;
        this.puzzleImages = this.originalPuyoImages.slice(); // デフォルト順
    }

    // 呼び出し元が puzzle 固定を要求する場合に順序をセットする。
    // orderArray は 1..5 の画像番号（index）を指定する配列（長さ5）。
    // 例: [2,1,3,4,5] など。指定なければデフォルト [1,2,3,4,5]
    static setPuzzleColorOrder(orderArray) {
        if (!Array.isArray(orderArray) || orderArray.length !== this.originalPuyoImages.length) {
            this.puzzleImages = this.originalPuyoImages.slice();
            return;
        }
        this.puzzleImages = orderArray.map(idx => {
            const i = idx - 1;
            return (this.originalPuyoImages[i]) ? this.originalPuyoImages[i] : this.originalPuyoImages[0];
        });
    }

    // puzzle モードの ON/OFF
    static enablePuzzleColorMode(enabled) {
        this.usePuzzleColors = Boolean(enabled);
    }

    static getPuyo(index) {
        // 安全化 + puzzle モードで固定色を使う場合
        if (this.usePuzzleColors) {
            if (!index || index < 1 || index > this.puzzleImages.length || !this.puzzleImages[index - 1]) {
                const placeholder = document.createElement('div');
                placeholder.style.width = Config.puyoImgWidth + 'px';
                placeholder.style.height = Config.puyoImgHeight + 'px';
                placeholder.style.borderRadius = '50%';
                placeholder.style.background = 'rgba(255,255,255,0.03)';
                placeholder.style.position = 'absolute';
                return placeholder;
            }
            return this.puzzleImages[index - 1].cloneNode(true);
        }

        // 通常モード（シャッフル済み配列）
        if (!index || index < 1 || index > this.puyoImages.length || !this.puyoImages[index - 1]) {
            const placeholder = document.createElement('div');
            placeholder.style.width = Config.puyoImgWidth + 'px';
            placeholder.style.height = Config.puyoImgHeight + 'px';
            placeholder.style.borderRadius = '50%';
            placeholder.style.background = 'rgba(255,255,255,0.03)';
            placeholder.style.position = 'absolute';
            return placeholder;
        }
        return this.puyoImages[index - 1].cloneNode(true);
    }

    static prepareBatankyu(frame) {
        this.gameOverFrame = frame;
        Stage.stageElement.appendChild(this.batankyuImage);
        this.batankyuImage.style.top = -this.batankyuImage.height + 'px';
    }

    static batankyu(frame) {
        const ratio = (frame - this.gameOverFrame) / Config.gameOverFrame;
        const x = Math.cos(Math.PI / 2 + ratio * Math.PI * 2 * 10) * Config.puyoImgWidth;
        const y = Math.cos(Math.PI + ratio * Math.PI * 2) * Config.puyoImgHeight * Config.stageRows / 4 + Config.puyoImgHeight * Config.stageRows / 2;
        this.batankyuImage.style.left = x + 'px';
        this.batankyuImage.style.top = y + 'px';
    }
}
