    <script>
        // 初期データ
        const locations = [
            // 砦
            "01号砦",
            "02号砦", 
            "03号砦", 
            "04号砦", 
            "05号砦",
            "06号砦", 
            "07号砦", 
            "08号砦", 
            "09号砦", 
            "10号砦",
            "11号砦", 
            "12号砦", 
            // 要塞
            "1号要塞", 
            "2号要塞", 
            "3号要塞", 
            "4号要塞"
        ];

        const rewards = [
            "1時間一般加速", 
            "上級都市移転", 
            "ジャスミンの欠片", 
            "ジンマンの欠片", 
            "エピック英雄の欠片",
            "レジェンド探検ブック", 
            "レジェンド遠征ブック", 
            "火晶", 
            "英雄経験値", 
            "英雄装備ラッキー宝箱",
            "100ポイント強化パーツ", 
            "通常野生の印", 
            "ペット突破材料セレクト", 
            "部隊HP上昇Ⅱ",
            "部隊ダメージ上昇Ⅱ", 
            "出撃容量上昇Ⅱ"
        ];

        const tableBody = document.querySelector('#fortress-table tbody');

        // テーブルを初期化
        locations.forEach(location => {
            const row = document.createElement('tr');

            // 場所列
            const locationCell = document.createElement('td');
            locationCell.textContent = location;
            row.appendChild(locationCell);

            // 前回取得同盟列
            const allianceCell = document.createElement('td');
            const allianceInput = document.createElement('input');
            allianceInput.type = 'text';
            allianceCell.appendChild(allianceInput);
            row.appendChild(allianceCell);

            // 今回の報酬列
            const rewardCell = document.createElement('td');
            const rewardSelect = document.createElement('select');

            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "--選択--";
            rewardSelect.appendChild(defaultOption);

            rewards.forEach(reward => {
                const option = document.createElement('option');
                option.value = reward;
                option.textContent = reward;
                rewardSelect.appendChild(option);
            });
            rewardCell.appendChild(rewardSelect);
            row.appendChild(rewardCell);

            tableBody.appendChild(row);
        });

        // 実行ボタンの処理
        document.getElementById('execute-button').addEventListener('click', () => {
            const rewardMap = new Map();

            tableBody.querySelectorAll('tr').forEach(row => {
                const location = row.cells[0].textContent;
                const alliance = row.cells[1].querySelector('input').value || "なし";
                const reward = row.cells[2].querySelector('select').value;

                if (reward) {
                    // 「号砦」と先頭のゼロを削除
                    const cleanedLocation = location.replace(/号砦,/g, ",").trim();

                    if (!rewardMap.has(reward)) {
                        rewardMap.set(reward, []);
                    }
                    rewardMap.get(reward).push({ location: cleanedLocation.replace(/^[0]+/, ""), alliance });
                }
            });

            const outputArea = document.getElementById('output-area');
            outputArea.innerHTML = "";

            rewardMap.forEach((entries, reward) => {
                const locations = entries.map(entry => entry.location).join(",");
                const alliances = entries.map(entry => entry.alliance).join(",");
                const line = `${locations}(${alliances})${reward}`;

                const outputLine = document.createElement('div');
                outputLine.className = 'output-line';
                outputLine.textContent = line;

                const copyButton = document.createElement('button');
                copyButton.textContent = "コピー";
                copyButton.className = 'copy-button';
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(line).then(() => {
                        alert('クリップボードにコピーしました！');
                    });
                });

                outputLine.appendChild(copyButton);
                outputArea.appendChild(outputLine);
            });
        });
    </script>
