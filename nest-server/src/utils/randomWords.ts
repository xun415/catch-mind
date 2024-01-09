const selectRandomWords = (wordList, excludes, selectCnt = 3, randomFunc = Math.random) => {
    const excluded = wordList.filter(word => !excludes.includes(word));

    const selectedWords = new Set();

    while (selectedWords.size <= selectCnt) {
        const randomIndex = Math.floor(randomFunc() * excluded.length);
        selectedWords.add(excluded[randomIndex]);
    }

    return Array.from(selectedWords);
};