import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import axios from 'axios';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import { departments } from '../../datas/departements';

import Card from '../Card/Card';

export default function Dashboard() {
  const [options, setOptions] = useState({
    departement: '01',
    date: '2022-01-01',
    size: '10000',
  });
  const [datas, setDatas] = useState({});
  const [loading, setLoading] = useState(true);

  function createObjectFromData(arrayData) {
    let newObject = {};
    for (let i = 0; i < arrayData.length; i++) {
      if (!newObject[arrayData[i].code_cours_eau]) {
        newObject[arrayData[i].code_cours_eau] = {
          temperatures: [arrayData[i].resultat],
          commune: [arrayData[i].libelle_commune],
          localisation: [arrayData[i].localisation],
        };
      } else {
        newObject[arrayData[i].code_cours_eau].temperatures.push(
          arrayData[i].resultat
        );
      }
    }
    return newObject;
  }

  function createObjectForDisplay(objectData) {
    let objectForDisplay = {};
    for (let key in objectData) {
      let tempArr = objectData[key].temperatures;
      let minTemp = Math.min(...tempArr).toFixed(2);
      let maxTemp = Math.max(...tempArr).toFixed(2);
      let avgTemp = (
        objectData[key].temperatures.reduce((acc, curVal) => acc + curVal) /
        objectData[key].temperatures.length
      ).toFixed(2);
      objectData[key].temperatures = {
        min: minTemp,
        max: maxTemp,
        avg: avgTemp,
      };
    }

    objectForDisplay = objectData;
    return objectForDisplay;
  }

  function transformDataForDisplay(datas) {
    let objectFromData = createObjectFromData(datas);
    setDatas(createObjectForDisplay(objectFromData));
  }

  const fetchData = async () => {
    try {
      let response = await axios.get(
        `https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_departement=${options.departement}&date_debut_mesure=${options.date}&date_fin_mesure=${options.date}&fields=resultat,libelle_commune,code_cours_eau,localisation&size=${options.size}`
      );
      transformDataForDisplay(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h1>Suivi de températures Hub'eau</h1>

      <p>
        Ce tableau de bord permet de consulter les températures minimales,
        maximales et moyennes des cours d'eau français de 2010 à 2022.
        <br />
        Les données sont filtrées selon le département et le jour de l'année.
      </p>

      <div className={styles.researchBar}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Choisissez une date"
            minDate={dayjs('01-01-2010')}
            maxDate={dayjs('12-31-2022')}
            defaultValue={dayjs('01-01-2022')}
            format="DD-MM-YYYY"
            slotProps={{
              textField: {
                readOnly: true,
              },
            }}
            onChange={(date) =>
              setOptions({
                ...options,
                date: dayjs(date).format('YYYY-MM-DD'),
              })
            }
          />
        </LocalizationProvider>

        <Autocomplete
          disablePortal
          options={departments}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Département" />
          )}
          defaultValue={departments[0].label}
          disableClearable={true}
          onChange={(_, departementNumber) =>
            setOptions({
              ...options,
              departement: departementNumber.number,
            })
          }
        />

        <div className={styles.searchButton} onClick={fetchData}>
          Lancer Votre recherche
        </div>
      </div>

      {loading && <h4>Chargement des données</h4>}

      {!loading && Object.keys(datas).length === 0 && (
        <h4>Nous ne disposons pas de donnée pour ce jour et ce département</h4>
      )}
      {!loading && Object.keys(datas).length > 0 && (
        <div className={styles.dashboardGrid}>
          {!loading &&
            Object.entries(datas).map(([key, value]) => (
              <Card
                key={key}
                code={key}
                localisation={value.localisation}
                commune={value.commune}
                maxTemp={value.temperatures.max}
                minTemp={value.temperatures.min}
                avgTemp={value.temperatures.avg}
              />
            ))}
        </div>
      )}
    </div>
  );
}
