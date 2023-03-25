import fs from 'fs';
import csv from 'fast-csv';
import inquirer from 'inquirer';
import readline from 'readline';

const cities = {
    aracaju: 0,
    belem: 1,
    'belo horizonte': 2,
    brasilia: 3,
    'campo grande': 4,
    cuiaba: 5,
    curitiba: 6,
    florianopolis: 7,
    fortaleza: 8,
    goiania: 9,
    'joao pessoa': 10,
    maceio: 11,
    manaus: 12,
    natal: 13,
    'porto alegre': 14,
    'porto velho': 15,
    recife: 16,
    'rio branco': 17,
    'rio de janeiro': 18,
    salvador: 19,
    'sao luis': 20,
    'sao paulo': 21,
    teresina: 22,
    vitoria: 23,
};

const showOptionsTravel = (option) => {
    switch (option) {
        case '1':
            console.log(
                `\nCidades disponíveis para consulta: Aracaju, Belém, Belo Horizonte, Brasília, Campo Grande, á, Curitiba, Florianópolis, Fortaleza, Goiânia, João Pessoa, Maceió, Manaus, Natal, Porto Alegre, Porto Velho, Recife, Rio Branco, Rio de Janeiro, Salvador, São Luís, São Paulo, Teresina, Vitória\n`,
            );
            console.log(
                `Modalidades de transporte disponíveis: 1 - Caminhão de pequeno porte, 2 - Caminhão de médio porte, 3 - Caminhão de grande porte\n`,
            );
            console.log(
                `A seguir insira os nomes das cidades e a modalidade de transporte conforme o número dela >\n`,
            );
            break;
        case '2':
            console.log(
                `\nCidades disponíveis para consulta: Aracaju, Belém, Belo Horizonte, Brasília, Campo Grande, á, Curitiba, Florianópolis, Fortaleza, Goiânia, João Pessoa, Maceió, Manaus, Natal, Porto Alegre, Porto Velho, Recife, Rio Branco, Rio de Janeiro, Salvador, São Luís, São Paulo, Teresina, Vitória\n`,
            );
            console.log(`Produtos disponíveis para transporte: 1 - Celular | 0.5 Kg; 2 - Geladeira | 60 Kg; 3 - Freezer | 100 Kg; 4 - Cadeira | 5 Kg; 5 - Luminária | 0.8 Kg; 9 - Lavadora de roupas | 120 Kg\n`);
            break;
        default:
            break;
    }
    
};

const results = [];

const getDistanceCities = async (city1, city2) => {
    let arrayDistanceBetweenCities = [];

    const promiseCallback = (resolve) => {
        fs.createReadStream('DNIT-Distancias.csv')
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => console.error(error))
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                const transformJsonInArray = Object.values(
                    results[city1],
                )[0].split(';');
                arrayDistanceBetweenCities = transformJsonInArray
                    .filter((val) => !isNaN(val))
                    .map((val) => parseInt(val));

                resolve(arrayDistanceBetweenCities[city2]);
            });
    };

    return new Promise(promiseCallback);
};

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
    };
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
};

const findCity = (cities, city) => {
    let find = false;
    for (let property in cities) {
        if (property === city.toLowerCase()) {
            find = true;
        }
    }
    return find;
};

const checkValidityInputCity = async (askCity) => {
    let city = '';
    do {
        city = await askCity();
        city = removeAccent(city);
        if (!findCity(cities, city)) {
            console.log('Cidade inválida, tente novamente.');
        }
    } while (!findCity(cities, city));

    return city.toLowerCase();
};

const removeAccent = (word) => {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const checkValidityInputMode = async () => {
    let mode = '';
    do {
        mode = await askTransportMode();
        if (mode !== '1' && mode !== '2' && mode !== '3') {
            console.log('Modalidade de transporte inválida, tente novamente.');
        }
    } while (mode !== '1' && mode !== '2' && mode !== '3');

    return mode;
};

const askCityOfDestinyOptionTwo = async (noLog = false) => { 
    // let city = '';

    (!noLog) && console.log('Digite a(s) cidade(s) de destino em ordem de parada, para finalizar digite "0"');
    const promiseCallback = (resolve) => { 
        rl.question('Cidade de destino: ', (city) => {
            resolve(city);
        });
    }
    return new Promise(promiseCallback);
}

const askTransportProductTotal = async (noLog) => { 
    let productAndQuantity = [];

    (!noLog) && console.log('A seguir insira o ID (numero) do produto e sua quantidade, para finalizar digite um ID inexistente');
    const promiseCallback = (resolve) => { 
        rl.question('Digite o ID do produto: ', (idProduct) => {
            if (parseInt(idProduct) < 1 || parseInt(idProduct) > 9) {
                productAndQuantity.push(0);
                resolve(productAndQuantity);
            } else {
                productAndQuantity.push(idProduct);
                rl.question('Digite a quantidade do produto: ', (quantity) => {
                    productAndQuantity.push(quantity);
                    resolve(productAndQuantity);
                });
            }
        });
    }
    return new Promise(promiseCallback);
}

const showMenu = async () => {
    console.log('\nEscolha uma opção:');
    console.log('1 - Consultar trechos x modalidade');
    console.log('2 - Cadastrar transporte');
    console.log('3 - Sair');

    rl.question('Opção escolhida: ', async (option) => {
        switch (option) {
            case '1':
                showOptionsTravel(1);

                let cityOrigin = '';
                let cityDestiny = '';

                cityOrigin = await checkValidityInputCity(askCityOfOrigin);
                cityDestiny = await checkValidityInputCity(askCityOfDestiny);
                const transportMode = await checkValidityInputMode();

                const distanceBetweenCities = await getDistanceCities(
                    cities[cityOrigin],
                    cities[cityDestiny],
                );
                const travel = travelCost(distanceBetweenCities, transportMode);

                console.log(
                    `De ${cityOrigin.toLocaleUpperCase()} para ${cityDestiny.toLocaleUpperCase()}, utilizando um ${
                        travel.nameTransportMode
                    }, a distância é de ${distanceBetweenCities} Km e o custo será de R$ ${travel.price.toFixed(
                        2,
                    )}.`,
                );

                rl.close();

                break;
            case '2':
                showOptionsTravel(2);

                // const cityOriginOptionTwo = await checkValidityInputCity(askCityOfOrigin);
                let citiesDestiny = [];
                let noLog = false;

                // console.log(await askTransportProductTotal());

                // do {
                //     citiesDestiny.push(await askCityOfDestinyOptionTwo(noLog));
                //     noLog = true;
                // } while (citiesDestiny[citiesDestiny.length - 1] !== '0');
                
                let totalproductAndQuantity = [];
                let IndexlastAddedProduct;
                const indexProduct = 0;
                noLog = false;

                do {
                    totalproductAndQuantity.push(await askTransportProductTotal(noLog));
                    IndexlastAddedProduct = totalproductAndQuantity.length - 1;
                    noLog = true;
                } while (totalproductAndQuantity[IndexlastAddedProduct][indexProduct] !== 0);

                console.log(totalproductAndQuantity);


                
                // console.log(citiesDestiny);

                rl.close();
                // showMenu();
                break;
            case '3':
                console.log('Até logo!');
                rl.close();
                break;
            default:
                console.log('Opção inválida.\n');
                showMenu();
                break;
        }
    });
};

showMenu();
