import { DataSource } from 'typeorm';

const dataSource = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "root",
        database: "db1",
        logging: true,
        entities: ["src/user/entities/**/*.ts"],
        migrations: ["src/user/migrations/**/*.ts"]
});

export default dataSource;
