const express= require("express");
const https= require("https");
const app= express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");

let weather={
    cityName: "",
    currentTemperature: "",
    description: "",
    feelsLike: "",
    windSpeed: "",
    windDegree: "",
    humidity: "",
    visibility: "",
    pressure: "",
    icon: "",
    bg_image:""
};

app.get("/", (req, res)=>{
    weather.cityName="Delhi";

    const url= `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=d4efbb40a67acc8976012c586e0e8e1c&units=metric`;
    https.get(url, (response)=>{
        response.on("data", (data)=>{
            const weatherData= JSON.parse(data);
            weatherData.weather[0].icon= weatherData.weather[0].icon.replace("n","d");
            weather.currentTemperature= weatherData.main.temp;
            weather.description= weatherData.weather[0].description;
            weather.feelsLike= weatherData.main.feels_like;
            weather.windSpeed= weatherData.wind.speed;
            weather.windDegree= weatherData.wind.deg;
            weather.humidity= weatherData.main.humidity;
            weather.visibility= weatherData.visibility;
            weather.pressure= weatherData.main.pressure;
            weather.icon= "http://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png";
            
            const image_url= "https://api.unsplash.com/photos/random?query="+ weather.description+"&landscape&client_id=Z1NBhjuAxlmNC-An6W6V86OBKZvnXEJae5VJz-6BNPs";
            
            https.get(image_url, (resp)=>{
                let chunks = [];
                resp.on("data", (img_data)=>{
                    chunks.push(img_data);
                });
                resp.on("end", ()=>{
                    let data2   = Buffer.concat(chunks);
                    let image = JSON.parse(data2);
                    weather.bg_image= "background-image:url("+ image.urls.full + ")";
                    console.log(weather.bg_image);
                    res.render("index", weather);
                });
            });
        });
    });
});

app.post("/", (req, res)=>{
    const body= req.body;
    weather.cityName=body.cityName;

    const url= `https://api.openweathermap.org/data/2.5/weather?q=${body.cityName}&appid=d4efbb40a67acc8976012c586e0e8e1c&units=metric`;
    https.get(url, (response)=>{
        response.on("data", (data)=>{
            const weatherData= JSON.parse(data);
            weatherData.weather[0].icon= weatherData.weather[0].icon.replace("n","d");
            weather.currentTemperature= weatherData.main.temp;
            weather.description= weatherData.weather[0].description;
            weather.feelsLike= weatherData.main.feels_like;
            weather.windSpeed= weatherData.wind.speed;
            weather.windDegree= weatherData.wind.deg;
            weather.humidity= weatherData.main.humidity;
            weather.visibility= weatherData.visibility;
            weather.pressure= weatherData.main.pressure;
            weather.icon= "http://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png";            

            const image_url= "https://api.unsplash.com/photos/random?query="+ weather.description +"&landscape&client_id=Z1NBhjuAxlmNC-An6W6V86OBKZvnXEJae5VJz-6BNPs";
            
            https.get(image_url, (resp)=>{
                let chunks = [];
                resp.on("data", (img_data)=>{
                    chunks.push(img_data);
                });
                resp.on("end", ()=>{
                    let data2   = Buffer.concat(chunks);
                    let image = JSON.parse(data2);
                    weather.bg_image= "background-image:url("+ image.urls.full + ")";
                    console.log(image.urls.full);
                    res.render("index", weather);
                });
            });

        });
    });
});



app.listen(80, ()=>{console.log("Server listening on port 80");});