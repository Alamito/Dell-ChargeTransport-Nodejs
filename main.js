import fs from 'fs';
import csv from 'fast-csv';
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

const weightOfProducts = {
    1: 0.5,
    2: 60,
    3: 100,
    4: 5,
    5: 0.8,
    6: 120,
};

const nameByIdProducts = {
    1: 'Celular',
    2: 'Geladeira',
    3: 'Freezer',
    4: 'Cadeira',
    5: 'Luminária',
    6: 'Lavadora de roupas',
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const showOptionsTravel = (option) => {
    switch (option) {
        case 1:
            console.log(`\nCidades disponíveis para consulta: Aracaju, Belém, Belo Horizonte, Brasília, Campo Grande, á, Curitiba, Florianópolis, Fortaleza, Goiânia, João Pessoa, Maceió, Manaus, Natal, Porto Alegre, Porto Velho, Recife, Rio Branco, Rio de Janeiro, Salvador, São Luís, São Paulo, Teresina, Vitória\n`);
            console.log(`Modalidades de transporte disponíveis: 1 - Caminhão de pequeno porte, 2 - Caminhão de médio porte, 3 - Caminhão de grande porte\n`);
            console.log(`A seguir insira os nomes das cidades e a modalidade de transporte conforme o número dela >\n`);
            break;
        case 2:
            console.log(`\nCidades disponíveis para transporte: Aracaju, Belém, Belo Horizonte, Brasília, Campo Grande, á, Curitiba, Florianópolis, Fortaleza, Goiânia, João Pessoa, Maceió, Manaus, Natal, Porto Alegre, Porto Velho, Recife, Rio Branco, Rio de Janeiro, Salvador, São Luís, São Paulo, Teresina, Vitória\n`);
            console.log(`Produtos disponíveis para transporte: 1 - Celular [0.5 Kg]; 2 - Geladeira [60 Kg]; 3 - Freezer [100 Kg]; 4 - Cadeira [5 Kg]; 5 - Luminária [0.8 Kg]; 6 - Lavadora de roupas [120 Kg]\n`);
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
                const transformJsonInArray = Object.values(results[city1])[0].split(';');
                arrayDistanceBetweenCities = transformJsonInArray.filter((val) => !isNaN(val)).map((val) => parseInt(val));

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
    !noLog && console.log('\nDigite a(s) cidade(s) de destino em ordem de parada, para finalizar digite "0"');
    const promiseCallback = (resolve) => {
        rl.question('Cidade de destino: ', (city) => {
            city = removeAccent(city);
            if (!findCity(cities, city) && city !== '0') {
                console.log('Cidade inválida, tente novamente.');
                resolve(null);
            } else {
                resolve(city.toLowerCase());
            }
        });
    };
    return new Promise(promiseCallback);
};

const askTransportProductTotal = async (noLog) => {
    let productAndQuantity = [];

    !noLog && console.log('\nA seguir insira o ID (numero) do produto e sua quantidade, para finalizar digite um ID inexistente');
    const promiseCallback = (resolve) => {
        rl.question('Digite o ID do produto: ', (idProduct) => {
            if (parseInt(idProduct) < 1 || parseInt(idProduct) > 6) {
                productAndQuantity.push(0);
                resolve(productAndQuantity);
            } else {
                productAndQuantity.push(parseInt(idProduct));
                rl.question('Digite a quantidade do produto: ', (quantity) => {
                    productAndQuantity.push(parseInt(quantity));
                    if (parseInt(quantity) <= 0) {
                        console.log('Quantidade inválida, tente novamente.');
                        resolve([null]);
                    }
                    resolve(productAndQuantity);
                });
            }
        });
    };
    return new Promise(promiseCallback);
};

const calcQuantityTruck = (weight) => {
    const quantityTruckLarge = Math.floor(weight / 10000);

    const quantityTruckMedium = Math.floor((weight - quantityTruckLarge * 10000) / 4000);

    const quantityTruckSmall = Math.ceil((weight - (quantityTruckMedium * 4000 + quantityTruckLarge * 10000)) / 1000);

    return {
        truckLarge: quantityTruckLarge,
        truckMedium: quantityTruckMedium,
        truckSmall: quantityTruckSmall,
    };
};

const calcTotalWeight = (weightOfProducts, productAndQuantity) => {
    let weight = 0;

    for (let i = 0; i < productAndQuantity.length; i += 1) {
        weight += weightOfProducts[productAndQuantity[i][0]] * productAndQuantity[i][1];
    }

    return weight;
};

const buildStringQuantityTrucks = (quantityTruck) => {
    let stringQuantityTrucks = '';

    if (quantityTruck.truckLarge > 0) {
        stringQuantityTrucks += `${quantityTruck.truckLarge} caminhão(s) de grande porte,`;
    }
    if (quantityTruck.truckMedium > 0) {
        stringQuantityTrucks += ` ${quantityTruck.truckMedium} caminhão(s) de médio porte,`;
    }
    if (quantityTruck.truckSmall > 0) {
        stringQuantityTrucks += ` ${quantityTruck.truckSmall} caminhão(s) de pequeno porte`;
    }

    return stringQuantityTrucks;
};

const calcPriceTravelByTruck = (quantityTruck, distanceBetweenCities) => {
    let totalPrice = 0;

    if (quantityTruck.truckLarge > 0) {
        totalPrice += travelCost(distanceBetweenCities, '3').price;
    }
    if (quantityTruck.truckMedium > 0) {
        totalPrice += travelCost(distanceBetweenCities, '2').price;
    }
    if (quantityTruck.truckSmall > 0) {
        totalPrice += travelCost(distanceBetweenCities, '1').price;
    }

    return totalPrice;
};

const calcMediumPriceByProduct = (priceTravel, products) => {
    let quantityProducts = 0;

    products.forEach((product) => {
        quantityProducts += product[1];
    });

    return priceTravel / quantityProducts;
};

const getDistanceBetweenMoreTwoCities = async (cityOrigin, citiesDestiny, cities) => {
    let totalDistance = 0;
    for (let i in citiesDestiny) {
        if (i == 0) totalDistance += await getDistanceCities(cityOrigin, cities[citiesDestiny[i]]);
        else {
            totalDistance += await getDistanceCities(cities[citiesDestiny[i - 1]], cities[citiesDestiny[i]]);
        }
    }
    return totalDistance;
};

const showUserinfoTravel = async (cityOrigin, citiesDestiny, cities, nameByIdProducts, products, quantityTruck) => {
    const lastCity = citiesDestiny.length - 1;

    let stringNameProducts = products.map((namesProducts) => nameByIdProducts[namesProducts[0]]);
    stringNameProducts = stringNameProducts.join(', '); // adiciona espaco depois da virgula

    if (citiesDestiny.length === 1) {
        // viagem direta
        const distanceBetweenCities = await getDistanceCities(cities[cityOrigin], cities[citiesDestiny[lastCity]]);
        const totalPrice = calcPriceTravelByTruck(quantityTruck, distanceBetweenCities);
        const mediumPriceByProduct = calcMediumPriceByProduct(totalPrice, products);
        const stringQuantityTrucks = buildStringQuantityTrucks(quantityTruck);

        process.stdout.write(`\n-> De ${cityOrigin.toLocaleUpperCase()} para ${citiesDestiny[lastCity].toLocaleUpperCase()}`);
        process.stdout.write(` a distancia total a ser percorrida é de ${distanceBetweenCities} Km,`);
        process.stdout.write(` para transportes dos produtos ${stringNameProducts},`);
        process.stdout.write(` será necessário utilizar ${stringQuantityTrucks},`);
        process.stdout.write(` de forma a resultar no menor custo por Km rodado.`);
        process.stdout.write(` O valor total do transporte dos itens é R$ ${totalPrice.toFixed(2)},`);
        process.stdout.write(` sendo R$ ${mediumPriceByProduct.toFixed(2)} o custo unitário médio.\n`);
    } else {
        // viagem com paradas
        const distanceBetweenCities = await getDistanceBetweenMoreTwoCities(cities[cityOrigin], citiesDestiny, cities);
        const totalPrice = calcPriceTravelByTruck(quantityTruck, distanceBetweenCities);
        const mediumPriceByProduct = calcMediumPriceByProduct(totalPrice, products);
        const stringQuantityTrucks = buildStringQuantityTrucks(quantityTruck);

        const stringStopCities = citiesDestiny.slice(0, lastCity).join(', ');

        process.stdout.write(`\n-> De ${cityOrigin.toLocaleUpperCase()} para ${citiesDestiny[lastCity].toLocaleUpperCase()} parando em ${stringStopCities.toLocaleUpperCase()}`);
        process.stdout.write(` a distancia total a ser percorrida é de ${distanceBetweenCities} Km,`);
        process.stdout.write(` para transportes dos produtos ${stringNameProducts},`);
        process.stdout.write(` será necessário utilizar ${stringQuantityTrucks},`);
        process.stdout.write(` de forma a resultar no menor custo por Km rodado.`);
        process.stdout.write(` O valor total do transporte dos itens é R$ ${totalPrice.toFixed(2)},`);
        process.stdout.write(` sendo R$ ${mediumPriceByProduct.toFixed(2)} o custo unitário médio.\n`);
        // o console.log() possui quebra de linha no final logo seria necessario escrever tudo em um unico console.log()
        // para que as mensagens ficassem na mesma linha
        // entao foi utilizado o process.stdout.write() para evitar a quebra de linha e deixar o codigo mais limpo
    }
};

const createStringPriceByTypeProduct = (weightOfProducts, nameByIdProducts, products, totalPrice) => {
    let stringPriceByTypeProduct = '';

    const weightTotal = calcTotalWeight(weightOfProducts, products);

    products.forEach((product) => {
        stringPriceByTypeProduct += `-> O preço médio do produto ${nameByIdProducts[product[0]]} é R$ ${((weightOfProducts[product[0]] / weightTotal) * totalPrice).toFixed(2)}\n`;
    });

    return stringPriceByTypeProduct;
};

const createStringPriceByTruck = (quantityTruck, distanceBetweenCities) => {
    let stringPriceByTypeProduct = '';
    let priceByTruck = 0;
    if (quantityTruck.truckLarge > 0) {
        priceByTruck = travelCost(distanceBetweenCities, '3').price;
        stringPriceByTypeProduct += `-> O preço de viagem do(s) ${quantityTruck.truckLarge} caminhão(oes) de grande porte é de R$ ${priceByTruck.toFixed(2)}\n`;
    }
    if (quantityTruck.truckMedium > 0) {
        priceByTruck = travelCost(distanceBetweenCities, '2').price;
        stringPriceByTypeProduct += `-> O preço de viagem do(s) ${quantityTruck.truckMedium} caminhão(oes) de médio porte é de R$ ${priceByTruck.toFixed(2)}\n`;
    }
    if (quantityTruck.truckSmall > 0) {
        priceByTruck = travelCost(distanceBetweenCities, '1').price;
        stringPriceByTypeProduct += `-> O preço de viagem do(s) ${quantityTruck.truckSmall} caminhão(oes) de pequeno porte é de R$ ${priceByTruck.toFixed(2)}\n`;
    }
    return stringPriceByTypeProduct;
};

const createStringPriceBySnippet = async (cities, cityOrigin, citiesDestiny, distanceBetweenCities, totalPrice) => {
    let distance = 0;
    let price = 0;
    let distanceBySnippet = '';

    for (let i in citiesDestiny) {
        if (i == 0) {
            distance = await getDistanceCities(cities[cityOrigin], cities[citiesDestiny[i]]);
            price = (distance / distanceBetweenCities) * totalPrice;
            distanceBySnippet += `-> De ${cityOrigin.toLocaleUpperCase()} para ${citiesDestiny[i].toLocaleUpperCase()} o custo por trecho é de R$ ${price.toFixed(2)}\n`;
        } else {
            distance = await getDistanceCities(cities[citiesDestiny[i - 1]], cities[citiesDestiny[i]]);
            price = (distance / distanceBetweenCities) * totalPrice;
            distanceBySnippet += `-> De ${citiesDestiny[i - 1].toLocaleUpperCase()} para ${citiesDestiny[i].toLocaleUpperCase()} o custo por trecho é de R$ ${price.toFixed(2)}\n`;
        }
    }
    return distanceBySnippet;
};

let travels = [];
const createStringWithInfoTravel = async (cityOrigin, citiesDestiny, cities, nameByIdProducts, products, quantityTruck, weightOfProducts) => {
    const lastCity = citiesDestiny.length - 1;

    if (citiesDestiny.length === 1) {
        // custo total
        const distanceBetweenCities = await getDistanceCities(cities[cityOrigin], cities[citiesDestiny[lastCity]]);
        const totalPrice = calcPriceTravelByTruck(quantityTruck, distanceBetweenCities);
        const stringTotalPrice = `-> O valor total de transporte dos itens é de R$ ${totalPrice.toFixed(2)}\n`;

        const mediumPriceByKm = totalPrice / distanceBetweenCities;
        const stringMediumPriceByKm = `-> O valor médio por Km rodado é de R$ ${mediumPriceByKm.toFixed(2)}\n`;

        const addQuantityProducts = products.reduce((acc, product) => acc + product[1], 0);
        const stringQuantityProducts = `-> Quantidade de produtos transportados: ${addQuantityProducts}\n`;

        const priceByTypeProduct = createStringPriceByTypeProduct(weightOfProducts, nameByIdProducts, products, totalPrice);

        const addQuantityTruck = quantityTruck.truckLarge + quantityTruck.truckMedium + quantityTruck.truckSmall;
        const stringQuantityTrucks = `-> Quantidade de veiculos deslocados: ${addQuantityTruck}\n`;

        const priceByTypeTruck = createStringPriceByTruck(quantityTruck, distanceBetweenCities);

        travels.push(`${stringTotalPrice}${stringMediumPriceByKm}${stringQuantityProducts}${priceByTypeProduct}${stringQuantityTrucks}${priceByTypeTruck}`);
    } else {
        // custo total
        const distanceBetweenCities = await getDistanceBetweenMoreTwoCities(cities[cityOrigin], citiesDestiny, cities);
        const totalPrice = calcPriceTravelByTruck(quantityTruck, distanceBetweenCities);
        const stringTotalPrice = `-> O valor total de transporte dos itens é de R$ ${totalPrice.toFixed(2)}\n`;

        const mediumPriceByKm = totalPrice / distanceBetweenCities;
        const stringMediumPriceByKm = `-> O valor médio por Km rodado é de R$ ${mediumPriceByKm.toFixed(2)}\n`;

        // custo por trecho
        const distanceBySnippet = await createStringPriceBySnippet(cities, cityOrigin, citiesDestiny, distanceBetweenCities, totalPrice);

        const addQuantityTruck = quantityTruck.truckLarge + quantityTruck.truckMedium + quantityTruck.truckSmall;
        const stringQuantityTrucks = `-> Quantidade de veiculos deslocados: ${addQuantityTruck}\n`;

        const priceByTypeTruck = createStringPriceByTruck(quantityTruck, distanceBetweenCities);

        const addQuantityProducts = products.reduce((acc, product) => acc + product[1], 0);
        const stringQuantityProducts = `-> Quantidade de produtos transportados: ${addQuantityProducts}\n`;

        const priceByTypeProduct = createStringPriceByTypeProduct(weightOfProducts, nameByIdProducts, products, totalPrice);

        travels.push(`${stringTotalPrice}${distanceBySnippet}${stringMediumPriceByKm}${stringQuantityProducts}${priceByTypeProduct}${stringQuantityTrucks}${priceByTypeTruck}`);
    }
};

const showMenu = async () => {
    console.log('\nEscolha uma opção:');
    console.log('1 - Consultar trechos x modalidade');
    console.log('2 - Cadastrar transporte');
    console.log('3 - Dados estatísticos');
    console.log('4 - Sair');

    rl.question('Opção escolhida: ', async (option) => {
        switch (option) {
            case '1':
                showOptionsTravel(1);

                let cityOrigin = '';
                let cityDestiny = '';

                cityOrigin = await checkValidityInputCity(askCityOfOrigin);
                cityDestiny = await checkValidityInputCity(askCityOfDestiny);
                const transportMode = await checkValidityInputMode();

                const distanceBetweenCities = await getDistanceCities(cities[cityOrigin], cities[cityDestiny]);
                const travel = travelCost(distanceBetweenCities, transportMode);

                process.stdout.write(`\n-> De ${cityOrigin.toLocaleUpperCase()} para ${cityDestiny.toLocaleUpperCase()},`);
                process.stdout.write(` utilizando um ${travel.nameTransportMode}, a distância é de ${distanceBetweenCities} Km`);
                process.stdout.write(` e o custo será de R$ ${travel.price.toFixed(2)}.\n`);

                showMenu();
                break;
            case '2':
                showOptionsTravel(2);

                const cityOriginOptionTwo = await checkValidityInputCity(askCityOfOrigin);
                let citiesDestiny = [];
                let noLog = false;

                do {
                    const response = await askCityOfDestinyOptionTwo(noLog);
                    if (response != null || response === '0') {
                        citiesDestiny.push(response);
                    }
                    noLog = true;
                } while (citiesDestiny[citiesDestiny.length - 1] !== '0');

                let totalproductAndQuantity = [];
                let IndexlastAddedProduct;
                const indexProduct = 0;
                noLog = false;
                let response = [];

                do {
                    response = await askTransportProductTotal(noLog);
                    IndexlastAddedProduct = totalproductAndQuantity.length - 1;
                    if (response[0] != null) totalproductAndQuantity.push(response);
                    noLog = true;
                } while (response[indexProduct] !== 0);

                totalproductAndQuantity.pop();
                const totalWeight = calcTotalWeight(weightOfProducts, totalproductAndQuantity);

                const quantityTruck = calcQuantityTruck(totalWeight);

                citiesDestiny.pop();

                await showUserinfoTravel(cityOriginOptionTwo, citiesDestiny, cities, nameByIdProducts, totalproductAndQuantity, quantityTruck);

                console.log('\nCarga cadastrada com sucesso!');

                await createStringWithInfoTravel(cityOriginOptionTwo, citiesDestiny, cities, nameByIdProducts, totalproductAndQuantity, quantityTruck, weightOfProducts);

                showMenu();
                break;
            case '3':
                if (travels.length != 0) {
                    travels.forEach((travel, index) => {
                        console.log(`\nVIAGEM ${index + 1}:`);
                        console.log(`${travel}`);
                    });
                } else {
                    console.log('\nNão há viagens cadastradas.');
                }

                showMenu();
                break;
            case '4':
                console.log('\nPROGRAMA ENCERRADO!\n');
                rl.close();
                break;
            default:
                console.log('\nOPÇÃO INVÁLIDA!');
                showMenu();
                break;
        }
    });
};

showMenu();
