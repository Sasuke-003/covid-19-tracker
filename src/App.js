import React, { useState, useEffect } from "react";
import { Card, FormControl, Select, MenuItem, CardContent } from "@material-ui/core";
import { req } from "./url";
import "./App.css";
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./components/LineGraph/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getWorldWideData = async () => {
      try {
        const res = await req.getCountryData(country);
        const data = await res.json();
        setCountryData(data);
        if (country === "worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(3);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          console.log([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getWorldWideData();
  }, [country]);

  useEffect(() => {
    const getCountriesData = async () => {
      const res = await req.getCountriesData();
      const data = await res.json();
      const countries = await data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
      setMapCountries(data);
    };
    getCountriesData();
  }, []);

  const handleCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    console.log(countryCode);
  };

  return (
    <div className='App'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19-TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' value={country} onChange={handleCountryChange}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app__status'>
          <InfoBox
            isRed
            active={casesType === "cases"}
            title='CoronaVirus Cases'
            cases={prettyPrintStat(countryData.todayCases)}
            total={countryData.cases}
            onClick={(e) => setCasesType("cases")}
          />
          <InfoBox
            active={casesType === "recovered"}
            title='Recovered'
            cases={prettyPrintStat(countryData.todayRecovered)}
            total={countryData.recovered}
            onClick={(e) => setCasesType("recovered")}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            title='Deaths'
            cases={prettyPrintStat(countryData.todayDeaths)}
            total={countryData.deaths}
            onClick={(e) => setCasesType("deaths")}
          />
        </div>
        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType} />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
