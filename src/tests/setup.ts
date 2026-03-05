import '@testing-library/jest-dom'; // nambah matcher dom tambahan misal tobeinthedocument
import { cleanup } from '@testing-library/react'; // ambil fungsi cleanup buat beresin hasil render habis test
import * as matchers from '@testing-library/jest-dom/matchers'; // ambil semua matcher jest-dom jadi object

expect.extend(matchers); // daftarin matcher jest-dom ke expect global

beforeEach(() => {
  vi.clearAllMocks(); // reset call history mock antar test biar test independen tanpa perlu diulang di tiap file
  localStorage.clear(); // reset storage global antar test biar state tidak bocor
});

afterEach(() => {
  cleanup(); // jalanin cleanup tiap selesai test biar dom dan state ga kebawa ke test lain
});
