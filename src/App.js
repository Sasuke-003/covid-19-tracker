import React, { useState, useEffect } from "react";
import { Card, FormControl, Select, MenuItem, CardContent } from "@material-ui/core";
import { req } from "./url";
import "./App.css";
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import { sortData } from "./util";
import LineGraph from "./components/LineGraph/LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getWorldWideData = async () => {
      try {
        const res = await req.getCountryData(country);
        const data = await res.json();
        setCountryData(data);
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
          <InfoBox title='CoronaVirus Cases' cases={countryData.todayCases} total={countryData.cases} />
          <InfoBox title='Recovered' cases={countryData.todayRecovered} total={countryData.recovered} />
          <InfoBox title='Deaths' cases={countryData.todayDeaths} total={countryData.deaths} />
        </div>
        <Map />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
