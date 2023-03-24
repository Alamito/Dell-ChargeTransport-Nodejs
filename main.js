const fs = require("fs");
const csv = require("fast-csv");

const results = [];

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

// fs.createReadStream("DNIT-Distancias.csv")
//   .pipe(csv.parse({ headers: true }))
//   .on("error", (error) => console.error(error))
//   .on("data", (row) => {
//     results.push(row);
//   })
//   .on("end", () => {
//       const values = Object.values(results[cities.aracaju])[0].split(";");
//       const numbers = values
//         .filter((val) => !isNaN(val))
//           .map((val) => parseInt(val));
//       console.log(numbers[cities.belem]);
//     // Aqui você pode trabalhar com os dados lidos do arquivo CSV.
//     // Por exemplo, você pode processar os dados, salvá-los em um banco de dados, etc.
//   });
const getDistanceCities = async (city1, city2) => {
    let arrayDistanceBetweenCities = [];

    const promiseCallback = (resolve, reject) => { 
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

const runTasks = async () => { 
    const distanceBetweenCities = await getDistanceCities(cities.curitiba, cities.aracaju);
    console.log(distanceBetweenCities);
}

runTasks();