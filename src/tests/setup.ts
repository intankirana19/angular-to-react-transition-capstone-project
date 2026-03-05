import '@testing-library/jest-dom'; // nambah matcher dom tambahan misal tobeinthedocument
import { cleanup } from '@testing-library/react'; // ambil fungsi cleanup buat beresin hasil render habis test
import * as matchers from '@testing-library/jest-dom/matchers'; // ambil semua matcher jest-dom jadi object

expect.extend(matchers); // daftarin matcher jest-dom ke expect global

beforeEach(() => {
  localStorage.clear(); // reset storage biar state antar test tidak bocor
});

afterEach(() => {
  vi.clearAllMocks(); // reset history mock vi.fn antar test
  vi.restoreAllMocks(); // balikin spyOn ke implementasi asli
  cleanup(); // beresin dom setelah tiap test
});
