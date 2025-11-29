import { Chicago } from './chicago';
import {
    chartByHour,
    chartByDay,
    chartByMonth,
    chartTimeline,
    chartTopPrimaryTypes,
    chartTopLocations,
    chartPie,
    chartByDistrict,
    chartArrestByType,
    clearAllCharts,
    chartByMonthLine
} from './visualizations';

let chicago = null;

async function loadData() {
    const loadBtn = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');
    const loading = document.querySelector('#loading');

    if (!loadBtn || !clearBtn || !loading) {
        console.error('Elementos não encontrados');
        return;
    }

    try {
        loadBtn.disabled = true;
        loading.style.display = 'block';

        // Initialize Chicago data loader
        chicago = new Chicago();
        await chicago.init();
        await chicago.loadData('chicago.parquet');

        console.log('Dados carregados com sucesso!');

        // Get data quality info
        const qualityInfo = await chicago.getDataQualityInfo();
        console.log('Informações de Qualidade dos Dados:', qualityInfo[0]);

        // Load all visualizations
        await loadAllVisualizations();

        loading.style.display = 'none';
        loadBtn.disabled = false;
        loadBtn.textContent = 'Dados Carregados ✓';
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert(`Erro ao carregar dados: ${error.message}\n\nCertifique-se de que o arquivo chicago.parquet está na pasta "00 - data".`);
        loading.style.display = 'none';
        loadBtn.disabled = false;
    }
}

async function loadAllVisualizations() {
    if (!chicago) {
        console.error('Dados não carregados');
        return;
    }

    try {
        // Temporal visualizations
        console.log('Carregando visualizações temporais...');
        const hourData = await chicago.getCrimesByHour();
        chartByHour(hourData, 'chart-hour');

        const dayData = await chicago.getCrimesByDayOfWeek();
        chartByDay(dayData, 'chart-day');

        const monthData = await chicago.getCrimesByMonth();
        chartByMonth(monthData, 'chart-month');
        
        const monthDataYear = await chicago.getCrimesByMonthAndYear();
        chartByMonthLine(monthDataYear, 'chart-street-month');

        const timelineData = await chicago.getTimelineData();
        chartTimeline(timelineData, 'chart-timeline');

        // Composition visualizations
        console.log('Carregando visualizações de composição...');
        const primaryTypeData = await chicago.getTopPrimaryTypes(10);
        chartTopPrimaryTypes(primaryTypeData, 'chart-primary-type');

        const locationData = await chicago.getTopLocations(10);
        chartTopLocations(locationData, 'chart-location');

        const arrestData = await chicago.getArrestDistribution();
        chartPie(arrestData, 'chart-arrest', 'Arrest');

        const domesticData = await chicago.getDomesticDistribution();
        chartPie(domesticData, 'chart-domestic', 'Domestic');

        // Additional analyses
        console.log('Carregando análises adicionais...');
        const districtData = await chicago.getCrimesByDistrict();
        chartByDistrict(districtData, 'chart-district');

        const arrestTypeData = await chicago.getArrestByPrimaryType();
        chartArrestByType(arrestTypeData, 'chart-arrest-type');

        console.log('Todas as visualizações foram carregadas!');
    } catch (error) {
        console.error('Erro ao carregar visualizações:', error);
        alert(`Erro ao carregar visualizações: ${error.message}`);
    }
}

function clearVisualizations() {
    clearAllCharts();
    const loadBtn = document.querySelector('#loadBtn');
    if (loadBtn) {
        loadBtn.textContent = 'Carregar Dados';
    }
}

function main() {
    const loadBtn = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        console.error('Botões não encontrados');
        return;
    }

    loadBtn.addEventListener('click', loadData);
    clearBtn.addEventListener('click', clearVisualizations);
}

window.onload = () => {
    main();
};

