import { loadDb } from './config';

export class Chicago {
    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();
        this.table = 'chicago_crimes';
    }

    async loadData(filename = 'chicago.parquet') {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        // Register the parquet file
        const res = await fetch(filename);
        const buffer = new Uint8Array(await res.arrayBuffer());
        await this.db.registerFileBuffer('chicago_data', buffer);

        // Create table from parquet file
        await this.conn.query(`
            CREATE TABLE ${this.table} AS
            SELECT * 
            FROM read_parquet('chicago_data');
        `);
    }

    async query(sql) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        let result = await this.conn.query(sql);
        return result.toArray().map(row => {
            const json = row.toJSON();
            // Convert BigInt values to numbers
            return Object.fromEntries(
                Object.entries(json).map(([key, value]) => [
                    key,
                    typeof value === 'bigint' ? Number(value) : value
                ])
            );
        });
    }

    // Query methods for different visualizations
    
    async getCrimesByHour() {
        const sql = `
            SELECT 
                EXTRACT(HOUR FROM "Date") as hour,
                COUNT(*) as count
            FROM ${this.table}
            WHERE "Date" IS NOT NULL
            GROUP BY EXTRACT(HOUR FROM "Date")
            ORDER BY hour
        `;
        return await this.query(sql);
    }

    async getCrimesByDayOfWeek() {
        const sql = `
            SELECT 
                CASE EXTRACT(DOW FROM "Date")
                    WHEN 0 THEN 'Domingo'
                    WHEN 1 THEN 'Segunda'
                    WHEN 2 THEN 'Terça'
                    WHEN 3 THEN 'Quarta'
                    WHEN 4 THEN 'Quinta'
                    WHEN 5 THEN 'Sexta'
                    WHEN 6 THEN 'Sábado'
                END as day_name,
                EXTRACT(DOW FROM "Date") as day_num,
                COUNT(*) as count
            FROM ${this.table}
            WHERE "Date" IS NOT NULL
            GROUP BY EXTRACT(DOW FROM "Date")
            ORDER BY 
                CASE EXTRACT(DOW FROM "Date")
                    WHEN 0 THEN 7
                    ELSE EXTRACT(DOW FROM "Date")
                END
        `;
        return await this.query(sql);
    }

    async getCrimesByMonth() {
        const sql = `
            SELECT 
                EXTRACT(MONTH FROM "Date") as month,
                CASE EXTRACT(MONTH FROM "Date")
                    WHEN 1 THEN 'Jan'
                    WHEN 2 THEN 'Fev'
                    WHEN 3 THEN 'Mar'
                    WHEN 4 THEN 'Abr'
                    WHEN 5 THEN 'Mai'
                    WHEN 6 THEN 'Jun'
                    WHEN 7 THEN 'Jul'
                    WHEN 8 THEN 'Ago'
                    WHEN 9 THEN 'Set'
                    WHEN 10 THEN 'Out'
                    WHEN 11 THEN 'Nov'
                    WHEN 12 THEN 'Dez'
                END as month_name,
                COUNT(*) as count
            FROM ${this.table}
            WHERE "Date" IS NOT NULL
            GROUP BY EXTRACT(MONTH FROM "Date")
            ORDER BY month
        `;
        return await this.query(sql);
    }

    async getCrimesByMonthAndYear() {
        const sql = `
            SELECT 
                EXTRACT(YEAR FROM "Date") AS year,
                EXTRACT(MONTH FROM "Date") AS month,
                CASE EXTRACT(MONTH FROM "Date")
                    WHEN 1 THEN 'Jan'
                    WHEN 2 THEN 'Fev'
                    WHEN 3 THEN 'Mar'
                    WHEN 4 THEN 'Abr'
                    WHEN 5 THEN 'Mai'
                    WHEN 6 THEN 'Jun'
                    WHEN 7 THEN 'Jul'
                    WHEN 8 THEN 'Ago'
                    WHEN 9 THEN 'Set'
                    WHEN 10 THEN 'Out'
                    WHEN 11 THEN 'Nov'
                    WHEN 12 THEN 'Dez'
                END AS month_name,
                COUNT(*) AS count
            FROM ${this.table}
            WHERE 
                "Date" IS NOT NULL
                AND "Location Description" IS NOT NULL
                AND "Location Description" = 'STREET'
            GROUP BY 
                EXTRACT(YEAR FROM "Date"),
                EXTRACT(MONTH FROM "Date")
            ORDER BY year, month;
        `;
        return await this.query(sql);
    }

    async getTimelineData() {
        const sql = `
            SELECT 
                CAST("Date" AS DATE) as date,
                COUNT(*) as count
            FROM ${this.table}
            WHERE "Date" IS NOT NULL
            GROUP BY CAST("Date" AS DATE)
            ORDER BY date
        `;
        return await this.query(sql);
    }

    async getTopPrimaryTypes(limit = 10) {
        const sql = `
            SELECT 
                "Primary Type" as primary_type,
                COUNT(*) as count
            FROM ${this.table}
            WHERE "Primary Type" IS NOT NULL
            GROUP BY "Primary Type"
            ORDER BY count DESC
            LIMIT ${limit}
        `;
        return await this.query(sql);
    }

    async getTopLocations(limit = 10) {
        const sql = `
            SELECT 
                "Location Description" as location,
                COUNT(*) as count
            FROM ${this.table}
            WHERE "Location Description" IS NOT NULL
            GROUP BY "Location Description"
            ORDER BY count DESC
            LIMIT ${limit}
        `;
        return await this.query(sql);
    }

    async getArrestDistribution() {
        const sql = `
            SELECT 
                CASE 
                    WHEN "Arrest" = true THEN 'Com Prisão'
                    WHEN "Arrest" = false THEN 'Sem Prisão'
                    ELSE 'Desconhecido'
                END as arrest_status,
                COUNT(*) as count
            FROM ${this.table}
            GROUP BY arrest_status
        `;
        return await this.query(sql);
    }

    async getDomesticDistribution() {
        const sql = `
            SELECT 
                CASE 
                    WHEN "Domestic" = true THEN 'Doméstico'
                    WHEN "Domestic" = false THEN 'Não Doméstico'
                    ELSE 'Desconhecido'
                END as domestic_status,
                COUNT(*) as count
            FROM ${this.table}
            GROUP BY domestic_status
        `;
        return await this.query(sql);
    }

    async getCrimesByDistrict() {
        const sql = `
            SELECT 
                "District" as district,
                COUNT(*) as count
            FROM ${this.table}
            WHERE "District" IS NOT NULL
            GROUP BY "District"
            ORDER BY count DESC
        `;
        return await this.query(sql);
    }

    async getArrestByPrimaryType() {
        const sql = `
            SELECT 
                "Primary Type" as primary_type,
                SUM(CASE WHEN "Arrest" = true THEN 1 ELSE 0 END) as with_arrest,
                SUM(CASE WHEN "Arrest" = false THEN 1 ELSE 0 END) as without_arrest,
                COUNT(*) as total
            FROM ${this.table}
            WHERE "Primary Type" IS NOT NULL
            GROUP BY primary_type
            HAVING total >= 100
            ORDER BY total DESC
            LIMIT 10
        `;
        return await this.query(sql);
    }

    async getDataQualityInfo() {
        const sql = `
            SELECT 
                COUNT(*) as total_records,
                COUNT("Date") as records_with_date,
                COUNT("Primary Type") as records_with_type,
                COUNT("Location Description") as records_with_location,
                COUNT("Arrest") as records_with_arrest,
                COUNT("Domestic") as records_with_domestic,
                MIN("Date") as min_date,
                MAX("Date") as max_date
            FROM ${this.table}
        `;
        return await this.query(sql);
    }
}

