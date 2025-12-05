# Архитектура Genshin Impact Damage Calculator

## Обзор
Веб-калькулятор урона для Genshin Impact (https://genshin.aspirine.su/)

## Технологический стек
- **Frontend**: React 18, jQuery, EJS шаблоны
- **Сборка**: Webpack 5, Babel
- **Тесты**: Jest
- **Скрипты данных**: Python 3.6+
- **OCR**: Tesseract.js (сканирование артефактов)
- **Деплой**: CentOS 7, nginx

## Структура проекта

```
├── bin/                    # Python скрипты генерации
│   ├── gen_string_table.py # Генератор строковых таблиц
│   └── import/             # Модули импорта данных
│       ├── artifact_*.py   # Импорт артефактов
│       ├── char_*.py       # Импорт персонажей
│       └── weapon_*.py     # Импорт оружия
│
├── new_bin/                # Новые скрипты импорта
│   ├── lib/genshin/        # Библиотека парсинга
│   ├── ambr_import_*.py    # Импорт с ambr.top
│   ├── hakushin_import_*.py# Импорт с hakushin
│   └── make_*_images.py    # Генерация изображений
│
├── data/strings/           # Локализация и данные
│   ├── 3.1/ - 5.8/         # Данные по версиям игры
│   ├── artifacts/          # Строки артефактов
│   ├── buffs/              # Строки баффов
│   ├── char/               # Строки персонажей (CSV)
│   ├── common/             # Общие строки
│   ├── enemy/              # Строки врагов
│   ├── generated/          # Сгенерированные данные
│   ├── ui/                 # Строки интерфейса
│   └── weapons/            # Строки оружия
│
├── src/                    # Исходный код
│   ├── js/                 # JavaScript
│   ├── css/                # Стили
│   ├── images/             # Изображения
│   ├── fonts/              # Шрифты (genshin.ttf)
│   ├── help/               # Справка (rus/eng)
│   ├── scripts/            # Вспомогательные скрипты
│   ├── index.ejs           # Главный шаблон
│   └── casino.ejs          # Шаблон казино
│
├── test/DB/                # Тесты базы данных
│
└── etc/                    # Конфигурации деплоя
    └── nginx/              # Конфиги nginx
```

## Архитектура JavaScript (src/js/)

### Точки входа (Entry Points)
```
src/js/
├── app.js      # Главное приложение
├── db.js       # База данных
├── ui.js       # UI компоненты
├── cli.js      # CLI интерфейс
└── Utils.js    # Утилиты
```

### Классы (src/js/classes/)

#### Основные сущности
```
classes/
├── App.js              # Главный класс приложения
├── Artifact.js         # Артефакт
├── ArtifactPool.js     # Пул артефактов
├── ArtifactSet.js      # Сет артефактов
├── Constellation.js    # Созвездие персонажа
├── Feature.js          # Фича/способность
├── Feature2.js         # Фича v2
├── Preset.js           # Пресет билда
├── Rotation.js         # Ротация способностей
└── Stats.js            # Статистики
```

#### Расчёты
```
classes/
├── CalcObject.js       # Объект расчёта
├── CalcSet.js          # Набор расчётов
├── StatsCalc.js        # Калькулятор статов
├── StatTable.js        # Таблица статов
├── ValueTable.js       # Таблица значений
├── RotationCompiler.js # Компилятор ротаций
└── PostEffect.js       # Пост-эффекты
```

#### Хранение данных
```
classes/
├── Storage.js          # Локальное хранилище
├── StorageItem.js      # Элемент хранилища
├── Serializer.js       # Сериализация
├── Backup.js           # Бэкапы
└── DbObject.js         # Объект БД
```

#### Импорт и сканирование
```
classes/
├── Scanner.js          # OCR сканер артефактов
├── Importer/           # Импортеры данных
└── API/                # API интеграции
```

#### Подбор артефактов
```
classes/
├── ArtifactsSuggest.js     # Подбор артефактов
├── ArtifactsSuggestSort.js # Сортировка подбора
├── SubstatCheck.js         # Проверка сабстатов
└── Generator/              # Генераторы
```

### База данных (src/js/db/)

```
db/
├── DB.js           # Главный модуль БД
├── Char.js         # Персонажи
├── Weapons.js      # Оружие
├── Artifacts.js    # Артефакты
├── Enemies.js      # Враги
├── Buffs.js        # Баффы
├── Conditions.js   # Условия
├── Features.js     # Фичи
├── Food.js         # Еда
├── Tree.js         # Дерево навыков
├── Objects.js      # Объекты
├── CalcData.js     # Данные расчётов
└── Constants.js    # Константы
```

#### Подпапки с данными
```
db/
├── Char/           # Данные персонажей
├── Weapon/         # Данные оружия
├── Artifacts/      # Данные артефактов
├── Enemies/        # Данные врагов
├── Buffs/          # Данные баффов
├── Conditions/     # Данные условий
├── Features/       # Данные фич
├── Food/           # Данные еды
├── Objects/        # Данные объектов
├── Tree/           # Данные деревьев
├── CalcData/       # Данные расчётов
└── generated/      # Сгенерированные данные
```

### UI компоненты (src/js/ui/)

```
ui/
├── Layout.js       # Главный лейаут
├── Lang.js         # Локализация
├── Modal.jsx       # Модальные окна
├── Tab.jsx         # Табы
├── Window.js       # Окна
├── Dropdown.js     # Выпадающие списки
├── Slider.js       # Слайдеры
├── Tooltip.js      # Тултипы
│
├── Components/     # React компоненты
├── Modal/          # Модальные окна
├── Tab/            # Компоненты табов
├── Wigdet/         # Виджеты
└── Window/         # Компоненты окон
```

### Web Workers (src/js/workers/)

```
workers/
├── ArtifactsGenerator.js       # Генерация артефактов
├── ArtifactsSuggest.js         # Подбор артефактов
├── ArtifactsSort.js            # Сортировка артефактов
├── ArtifactSetSuggest.js       # Подбор сетов
├── ArtifactMainStatSuggest.js  # Подбор мейнстатов
└── WeaponsSuggest.js           # Подбор оружия
```

## Стили (src/css/)

```
css/
├── app.css         # Главные стили
├── inputs.css      # Стили инпутов
├── modal.css       # Стили модалок
├── test.css        # Тестовые стили
│
├── Components/     # Стили компонентов
├── generated/      # Сгенерированные стили
├── icons/          # Иконки
├── modal/          # Стили модальных окон
└── ui/             # Стили UI элементов
```

## Изображения (src/images/)

```
images/
├── artifacts/      # Изображения артефактов
├── chars/          # Изображения персонажей
├── weapons/        # Изображения оружия
├── enemies/        # Изображения врагов
├── food/           # Изображения еды
├── domains/        # Изображения подземелий
├── icons/          # Иконки
├── sprites/        # Спрайты
└── help/           # Изображения справки
```

## Потоки данных

### 1. Импорт данных игры
```
Источники (ambr.top, hakushin) 
    → Python скрипты (new_bin/)
    → CSV файлы (data/strings/)
    → gen_string_table.py
    → JS модули (src/js/lang/)
```

### 2. Расчёт урона
```
Пользовательский ввод
    → CalcObject
    → StatsCalc (применение баффов, условий)
    → RotationCompiler (компиляция ротации)
    → Feature/PostEffect (расчёт урона)
    → Результат
```

### 3. Подбор артефактов
```
Параметры подбора
    → Web Worker (ArtifactsSuggest)
    → Генерация комбинаций
    → Расчёт урона для каждой
    → Сортировка результатов
    → Топ билдов
```

### 4. OCR сканирование
```
Скриншот артефакта
    → Tesseract.js
    → Scanner.js (парсинг)
    → Artifact объект
    → Сохранение в Storage
```

## Сборка

### Production
```bash
npm run build:lang   # Генерация строк
webpack --mode=production
```

### Development
```bash
npm run watch        # С hot reload
```

### Draft версия
```bash
npm run build:draft  # Для тестирования новых фич
```

## Тестирование

```bash
npm test             # Jest тесты
```

Тесты находятся в `test/DB/`:
- CondStrings.js — тесты строк условий
- RotationIds.js — тесты ID ротаций
- SerializeIds.js — тесты сериализации
- TalentStrings.js — тесты строк талантов

## Деплой

- Сервер: CentOS 7
- Web-сервер: nginx
- Конфиги: `etc/nginx/`
- Spec файл: `etc/genshin.spec`
