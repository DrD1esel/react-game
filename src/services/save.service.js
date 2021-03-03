class SaveService {
  static saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  static loadSettings() {
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : null;
  }

  static saveFinishedGame(result) {
    let results = SaveService.loadResults();
    if(results.length === 10) {
      results.shift();
    }
    results.push(result)
    localStorage.setItem('results', JSON.stringify(results));
    localStorage.setItem('game', JSON.stringify(null));
  }

  static loadResults() {
    let results = localStorage.getItem('results');
    return results ? JSON.parse(results) : [];
  }

  static saveGame(game) {
    localStorage.setItem('game', JSON.stringify(game));
  }

  static loadGame() {
    const game = localStorage.getItem('game');
    return game ? JSON.parse(game) : null;
  }

  static clearGame() {
    localStorage.setItem('game', JSON.stringify(null));
  }
}

export default SaveService;
