import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateRating,
  formatScore,
  slugify,
  filterAndSortProducts,
  getTopRated,
  getLowestRated,
} from './tadimmetre';
import { Product, ProductFilterState } from '../types';

test('evaluateRating correctly categorizes all score ranges', () => {
  // 0 - 3: Beğenilmedi
  assert.equal(evaluateRating(0).level, 'disliked');
  assert.equal(evaluateRating(2.5).level, 'disliked');
  assert.equal(evaluateRating(3.0).level, 'disliked');
  assert.equal(evaluateRating(3.0).label, 'Beğenilmedi');

  // 3.5 - 5: Ortalama altı
  assert.equal(evaluateRating(3.5).level, 'below_average');
  assert.equal(evaluateRating(4.0).level, 'below_average');
  assert.equal(evaluateRating(5.0).level, 'below_average');
  assert.equal(evaluateRating(4.5).label, 'Ortalama Altı');

  // 5.5 - 7: Ortalama
  assert.equal(evaluateRating(5.5).level, 'average');
  assert.equal(evaluateRating(6.5).level, 'average');
  assert.equal(evaluateRating(7.0).level, 'average');
  assert.equal(evaluateRating(6.0).label, 'Ortalama');

  // 7.5 - 8.5: Beğenildi
  assert.equal(evaluateRating(7.5).level, 'liked');
  assert.equal(evaluateRating(8.0).level, 'liked');
  assert.equal(evaluateRating(8.5).level, 'liked');
  assert.equal(evaluateRating(8.0).label, 'Beğenildi');

  // 9 - 10: Muhteşem
  assert.equal(evaluateRating(9.0).level, 'amazing');
  assert.equal(evaluateRating(9.5).level, 'amazing');
  assert.equal(evaluateRating(10.0).level, 'amazing');
  assert.equal(evaluateRating(9.5).label, 'Muhteşem');
});

test('formatScore formats scores cleanly', () => {
  assert.equal(formatScore(8.0), '8');
  assert.equal(formatScore(8.5), '8.5');
  assert.equal(formatScore(10), '10');
  assert.equal(formatScore(3.5), '3.5');
});

test('slugify generates SEO friendly Turkish slugs', () => {
  assert.equal(slugify('Tadım Tabağı Demo Çikolata'), 'tadim-tabagi-demo-cikolata');
  assert.equal(slugify('Şölen Luppo Çilekli Gofret!'), 'solen-luppo-cilekli-gofret');
  assert.equal(slugify('Bisküvi & Fıstık Ezmesi (Yeni)'), 'biskuvi-fistik-ezmesi-yeni');
});

test('filterAndSortProducts correctly filters by search and sorts by rating', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      slug: 'urun-1',
      title: 'Karam Gurme Çikolata',
      brand: 'Eti',
      category: 'Çikolata',
      imageUrl: '',
      market: 'Migros',
      tastingDate: '2026-10-01',
      rating: 8.5,
      review: 'Çok iyi',
      createdAt: 100,
      updatedAt: 100,
    },
    {
      id: '2',
      slug: 'urun-2',
      title: 'Acı Cips Ekstra',
      brand: 'Doritos',
      category: 'Cips',
      imageUrl: '',
      market: 'BİM',
      tastingDate: '2026-10-05',
      rating: 9.5,
      review: 'Harika',
      createdAt: 200,
      updatedAt: 200,
    },
    {
      id: '3',
      slug: 'urun-3',
      title: 'Tuzlu Fıstık Bar',
      brand: 'Tadım',
      category: 'Atıştırmalık',
      imageUrl: '',
      market: 'A101',
      tastingDate: '2026-09-20',
      rating: 3.0,
      review: 'Kötüydü',
      createdAt: 300,
      updatedAt: 300,
    },
  ];

  const filter1: ProductFilterState = {
    searchQuery: 'cips',
    category: 'all',
    market: 'all',
    brand: 'all',
    minRating: 0,
    maxRating: 10,
    sortBy: 'highest_rating',
  };

  const res1 = filterAndSortProducts(mockProducts, filter1);
  assert.equal(res1.length, 1);
  assert.equal(res1[0].title, 'Acı Cips Ekstra');

  // Test sorting by highest rating
  const filterSortHighest: ProductFilterState = {
    searchQuery: '',
    category: 'all',
    market: 'all',
    brand: 'all',
    minRating: 0,
    maxRating: 10,
    sortBy: 'highest_rating',
  };
  const resSortHighest = filterAndSortProducts(mockProducts, filterSortHighest);
  assert.equal(resSortHighest[0].rating, 9.5);
  assert.equal(resSortHighest[2].rating, 3.0);

  // Top rated and lowest rated helpers
  const top1 = getTopRated(mockProducts, 1);
  assert.equal(top1[0].id, '2');

  const low1 = getLowestRated(mockProducts, 1);
  assert.equal(low1[0].id, '3');
});
