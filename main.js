import fs from 'fs';
import csv from 'fast-csv';
import inquirer from 'inquirer';
import readline from 'readline';

const cities = {
    'aracaju': 0,
    'belem': 1,
    'belo horizonte': 2,
    'brasilia': 3,
    'campo grande': 4,
    'cuiaba': 5,
    'curitiba': 6,
    'florianopolis': 7,
    'fortaleza': 8,
    'goiania': 9,
    'joao pessoa': 10,
    'maceio': 11,
    'manaus': 12,
    'natal': 13,
    'porto alegre': 14,
    'porto velho': 15,
    'recife': 16,
    'rio branco': 17,
    'rio de janeiro': 18,
    'salvador': 19,
    'sao luis': 20,
    'sao paulo': 21,
    'teresina': 22,
    'vitoria': 23,
}

const results = [];

const getIdCity = (city) => { 
    console.log(cities[city]);
}

const getDistanceCities = async (city1, city2) => {
    // getIdCity(city1);
    let arrayDistanceBetweenCities = [];

    const promiseCallback = (resolve) => { 
        fs.createReadStream("DNIT-Distancias.csv")
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => console.error(error))
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", () => {
            const transformJsonInArray = Object.values(results[city1])[0].split(";");
            arrayDistanceBetweenCities = transformJsonInArray
                .filter((val) => !isNaN(val))
                .map((val) => parseInt(val));
            
            resolve(arrayDistanceBetweenCities[city2]);
        });
    }

    return new Promise(promiseCallback);
}

const travelCost = (distance, mode) => {
    let price;
    let nameTransportMode;
    switch (mode) {
        case '1':
            price = distance * 4.87;
            nameTransportMode = 'Caminhão de pequeno porte';
            break;
        case '2':
            price = distance * 11.92;
            nameTransportMode = 'Caminhão de médio porte';
            break;
        case '3':
            price = distance * 27.44;
            nameTransportMode = 'Caminhão de grande porte';
            break;
    }
    return { price, nameTransportMode };
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askCityOfOrigin = async () => {
    let city = '';
    const promiseCallback = (resolve) => {
        rl.question('Digite a cidade de origem: ', (userCity) => {
            city = userCity;
            resolve(city);
        });
    }
    return new Promise(promiseCallback);
};

const askCityOfDestiny = async () => {
    let city = '';
    const promiseCallback = (resolve) => {
        rl.question('Digite a cidade de destino: ', (userDestiny) => {
            city = userDestiny;
            resolve(city);
        });
    };
    return new Promise(promiseCallback);
};

const askTransportMode = async () => { 
    let mode = '';
    const promiseCallback = (resolve) => {
        rl.question('Digite a modalidade de transporte: ', (userMode) => {
            mode = userMode;
            resolve(mode);
        });
    };
    return new Promise(promiseCallback);
}


const menu = async () => {
    console.log('Escolha uma opção:');
    console.log('1 - Consultar trechos x modalidade');
    console.log('2 - Opção 2');
    console.log('3 - Sair');

    rl.question('Opção escolhida: ', async (opcao) => {
        switch (opcao) {
            case '1':
                const cityOrigin = await askCityOfOrigin();
                const cityDestiny = await askCityOfDestiny();
                const transportMode = await askTransportMode();

                let distanceBetweenCities;
                let travel;

                if (findCity(cities, cityOrigin) && findCity(cities, cityDestiny)) {
                    distanceBetweenCities = await getDistanceCities(cities[cityOrigin], cities[cityDestiny]);
                }

                if (transportMode === '1' || transportMode === '2' || transportMode === '3') { 
                    travel = travelCost(distanceBetweenCities, transportMode);
                }

                console.log(`De ${cityOrigin} para ${cityDestiny}, utilizando um ${travel.nameTransportMode}, a distância é de ${distanceBetweenCities} km e o custo será de R$ ${travel.price.toFixed(2)}.`);

                rl.close();

                break;
            case '2':
                console.log('Você escolheu a opção 2.\n');
                menu();
                break;
            case '3':
                console.log('Até logo!');
                rl.close();
                break;
            default:
                console.log('Opção inválida.\n');
                menu();
                break;
        }
    });
}

menu();

const findCity = async (cities, city) => {
    let find = false;
    for (let property in cities) { 
        if (property === city) { 
            find = true;
        }
    }
    return find;
}

const runTasks = async () => { 
    
    const distanceBetweenCities = await getDistanceCities(cities.aracaju, cities.manaus);
    const travelCost = calcTravelCost(distanceBetweenCities, 'bigSize');
    console.log(travelCost);
}

// runTasks();

// teste();