# Рекомендации по оптимизации

## 1. Webpack и сборка

### 1.1 Обновить зависимости
```json
// package.json - устаревшие версии
"webpack": "5.44.0"        // → 5.90+
"webpack-cli": "4.7.2"     // → 4.10+
"file-loader": "^6.2.0"    // → заменить на asset modules (встроено в webpack 5)
```

### 1.2 Использовать Asset Modules вместо file-loader
```javascript
// webpack.config.js - заменить file-loader
{
    test: /\.(ttf|woff2?)$/,
    type: 'asset/resource',
    generator: {
        filename: 'fonts/[name][ext]'
    }
},
{
    test: /\.(png|svg|jpe?g|gif|webp)$/,
    type: 'asset/resource',
    generator: {
        filename: 'images/[name][ext]'
    }
}
```

### 1.3 Добавить code splitting
```javascript
// webpack.config.js
optimization: {
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
            },
            db: {
                test: /[\\/]src[\\/]js[\\/]db[\\/]/,
                name: 'database',
                chunks: 'all',
                minSize: 0,
            }
        }
    }
}
```

### 1.4 Добавить кэширование сборки
```javascript
// webpack.config.js
cache: {
    type: 'filesystem',
    buildDependencies: {
        config: [__filename]
    }
}
```

## 2. JavaScript оптимизации

### 2.1 Stats.js — избежать создания функций в цикле
```javascript
// Текущий код создаёт функции каждый раз
getConcatFunc() {
    let code = [];
    for (let stat of Object.keys(this)) {
        code.push(`stats.${stat} += ${this[stat]}`);
    }
    return Function('stats', code.join(';'))
}

// Лучше: кэшировать функции
const funcCache = new Map();

getConcatFunc() {
    const key = Object.keys(this).sort().join(',');
    if (funcCache.has(key)) {
        return funcCache.get(key);
    }
    // ... создание функции
    funcCache.set(key, func);
    return func;
}
```

### 2.2 ArtifactsSuggest.js — оптимизация горячего цикла
```javascript
// Текущий код в getResult() создаёт объекты в цикле
while (combination = generator.next()) {
    artStats = new Stats();  // ← создание объекта каждую итерацию
    initialStatFunc(artStats);
    // ...
}

// Лучше: переиспользовать объект
const artStats = new Stats();
while (combination = generator.next()) {
    // Очистить и переиспользовать
    for (let key in artStats) delete artStats[key];
    initialStatFunc(artStats);
    // ...
}
```

### 2.3 Использовать Map вместо Object для частых операций
```javascript
// Текущий код
this.setData = {};
this.setData[setId] = {};

// Лучше для частого доступа
this.setData = new Map();
this.setData.set(setId, new Map());
```

### 2.4 Избегать spread operator в горячих путях
```javascript
// Медленно
let settings = Object.assign({}, this.buildData.settings);

// Быстрее для простых объектов
let settings = {};
for (let k in this.buildData.settings) {
    settings[k] = this.buildData.settings[k];
}
```

## 3. React оптимизации

### 3.1 Lazy loading компонентов
```javascript
// src/js/ui.js — загружать компоненты по требованию
const ArtifactScanner = React.lazy(() => import('./ui/Window/ArtifactScanner'));
const GoodImportModal = React.lazy(() => import('./ui/Modal/GoodImport.jsx'));
```

### 3.2 Мемоизация тяжёлых компонентов
```javascript
// Обернуть тяжёлые компоненты
export const ArtifactTooltip = React.memo(function ArtifactTooltip(props) {
    // ...
});
```

### 3.3 Использовать useMemo/useCallback
```javascript
// Для тяжёлых вычислений в компонентах
const features = useMemo(() => {
    return app.getFeatures(data);
}, [data]);
```

## 4. CSS оптимизации

### 4.1 Объединить CSS файлы иконок
```javascript
// Текущий код — 15+ отдельных импортов CSS
import "../css/generated/icons_chars.css"
import "../css/generated/icons_enemies_abyss.css"
// ...

// Лучше: один файл icons.css или CSS sprites
```

### 4.2 Использовать CSS containment
```css
/* Для списков артефактов/персонажей */
.artifact-list-item {
    contain: layout style paint;
}
```

## 5. Web Workers

### 5.1 Использовать SharedArrayBuffer для больших данных
```javascript
// Вместо копирования артефактов
const sharedBuffer = new SharedArrayBuffer(artifactsData.byteLength);
// Передать ссылку в worker
```

### 5.2 Добавить worker pool
```javascript
// Для параллельной обработки
class WorkerPool {
    constructor(workerScript, poolSize = navigator.hardwareConcurrency) {
        this.workers = Array(poolSize).fill(null).map(() => 
            new Worker(workerScript)
        );
        this.queue = [];
    }
    // ...
}
```

## 6. Данные и хранение

### 6.1 Сжатие данных в localStorage
```javascript
// Использовать LZ-string для сжатия
import LZString from 'lz-string';

storage.set = (key, value) => {
    const compressed = LZString.compressToUTF16(JSON.stringify(value));
    localStorage.setItem(key, compressed);
};
```

### 6.2 IndexedDB для артефактов
```javascript
// localStorage ограничен ~5MB
// IndexedDB лучше для больших коллекций артефактов
const db = await openDB('genshin-calc', 1, {
    upgrade(db) {
        db.createObjectStore('artifacts', { keyPath: 'id' });
    }
});
```

## 7. Загрузка данных

### 7.1 Ленивая загрузка данных персонажей
```javascript
// Загружать данные персонажа только при выборе
async function loadCharData(charId) {
    if (!charDataCache[charId]) {
        charDataCache[charId] = await import(`./db/Char/${charId}.js`);
    }
    return charDataCache[charId];
}
```

### 7.2 Предзагрузка критичных данных
```html
<link rel="preload" href="js/db.js" as="script">
<link rel="preload" href="js/lang/ru.js" as="script">
```

## 8. Изображения

### 8.1 Использовать WebP с fallback
```javascript
// webpack.config.js — добавить image-webpack-loader
{
    test: /\.(png|jpe?g)$/,
    use: [
        {
            loader: 'image-webpack-loader',
            options: {
                webp: { quality: 80 }
            }
        }
    ]
}
```

### 8.2 Lazy loading изображений
```javascript
// Использовать Intersection Observer (уже есть react-intersection-observer)
<img loading="lazy" src={charIcon} />
```

## 9. Быстрые победы (Quick Wins)

### 9.1 Добавить production hints
```javascript
// webpack.config.js
performance: {
    hints: 'warning',
    maxAssetSize: 500000,
    maxEntrypointSize: 500000
}
```

### 9.2 Включить tree shaking для lodash (если используется)
```javascript
// Вместо
import _ from 'lodash';
// Использовать
import debounce from 'lodash/debounce';
```

### 9.3 Удалить jQuery постепенно
```javascript
// jQuery используется минимально, можно заменить на vanilla JS
// $(...).on('click') → element.addEventListener('click')
// $(...).addClass() → element.classList.add()
```

## 10. Профилирование

### Инструменты для анализа:
```bash
# Анализ бандла
npx webpack-bundle-analyzer dist/stats.json

# Генерация stats.json
webpack --mode=production --json > dist/stats.json
```

## Приоритеты оптимизации

| Приоритет | Задача | Эффект |
|-----------|--------|--------|
| 🔴 Высокий | Code splitting + lazy loading | -30-50% initial load |
| 🔴 Высокий | Оптимизация ArtifactsSuggest | +20-40% скорость подбора |
| 🟡 Средний | Asset modules вместо file-loader | Упрощение конфига |
| 🟡 Средний | CSS объединение | -10-15% CSS размер |
| 🟢 Низкий | Удаление jQuery | -30KB gzipped |
| 🟢 Низкий | WebP изображения | -20-30% размер картинок |
