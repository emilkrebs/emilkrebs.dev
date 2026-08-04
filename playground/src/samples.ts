import typeSystem from './samples/type-system.bio?raw';
import basicSupplements from './samples/basic-supplements.bio?raw';
import sleepOptimization from './samples/sleep-optimization.bio?raw';
import interactionCheck from './samples/interaction-check.bio?raw';

export interface Sample {
  label: string;
  file: string;
  content: string;
}

export const SAMPLES: Sample[] = [
  {
    label: 'Type system',
    file: 'type-system.bio',
    content: typeSystem,
  },
  {
    label: 'Basic supplements',
    file: 'basic-supplements.bio',
    content: basicSupplements,
  },
  {
    label: 'Sleep optimization',
    file: 'sleep-optimization.bio',
    content: sleepOptimization,
  },
  {
    label: 'Interaction checker',
    file: 'interaction-check.bio',
    content: interactionCheck,
  },
];
