let model;
const classNames = ["class_1", "class_2", "class_3", ..., "class_102"]; // Укажите ваши классы

// Загрузка модели TensorFlow.js
async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log('Model loaded successfully');
}
loadModel();

// Функция для подготовки изображения
function preprocessImage(img) {
    return tf.browser.fromPixels(img)
        .resizeNearestNeighbor([128, 128]) // Изменить размер на 128x128
        .toFloat()
        .div(tf.scalar(255)) // Нормализация
        .expandDims(0);      // Добавить батч-измерение
}

// Функция для запуска классификации
async function classifyImage() {
    const imgElement = document.getElementById('image');
    const tensor = preprocessImage(imgElement);
    const prediction = await model.predict(tensor);

    // Получаем класс с максимальной вероятностью
    const predictedClass = prediction.argMax(-1).dataSync()[0];
    document.getElementById('prediction').innerText = classNames[predictedClass];
}

// Обработчик загрузки изображения
document.getElementById('uploadImage').addEventListener('change', (event) => {
    const file = event.target.files[0];

    // Проверяем наличие файла
    if (!file) return;

    // Показываем загруженное изображение
    const imgElement = document.getElementById('image');
    imgElement.src = URL.createObjectURL(file);
    imgElement.style.display = 'block';

    // Показываем кнопку Start
    document.getElementById('startButton').style.display = 'block';
});

// Обработчик нажатия на кнопку Start
document.getElementById('startButton').addEventListener('click', async () => {
    document.getElementById('prediction').innerText = 'Processing...';
    await classifyImage();
});
