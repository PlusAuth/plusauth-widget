import { setProjectAnnotations } from '@storybook/vue3';
import { beforeAll } from 'vitest';

import * as previewAnnotations from './preview.tsx';

const annotations = setProjectAnnotations([previewAnnotations]);

beforeAll(annotations.beforeAll);
