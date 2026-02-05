import express, { Application } from 'express';
import patientRoutes from './src/routes/patients.routes';

const app: Application = express();
const PORT = 5000;

app.use('/api/patients', patientRoutes);

app.listen(PORT, () => {
  console.log(`Patients endpoint: http://localhost:${PORT}/api/patients`);
});

export default app;
