export const URL = {
  getCountriesData: "https://disease.sh/v3/covid-19/countries",
  getCountryData: "https://disease.sh/v3/covid-19/countries/",
  getWorldWideData: "https://disease.sh/v3/covid-19/all",
  getHistoryData: "https://disease.sh/v3/covid-19/historical/all?lastdays=120",
};

export const req = {
  getCountriesData: async () => await fetch(URL.getCountriesData),
  getCountryData: async (countryCode) =>
    countryCode === "worldwide" ? await fetch(URL.getWorldWideData) : await fetch(URL.getCountryData + countryCode),
  getHistoryData: async () => await fetch(URL.getHistoryData),
};
