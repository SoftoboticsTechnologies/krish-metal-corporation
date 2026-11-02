/* =====================================================================
   KRISH METAL CORPORATION – PRODUCT DATA (single source of truth)
   ---------------------------------------------------------------------
   All technical data below is taken from the company catalogue
   (assets/catalogue/Krish-Metal-Corporation-Catalogue.pdf).

   HOW IT WORKS
   - KMC.categories : one entry per product page (menu, cards, page text)
   - KMC.series     : one entry per catalogue profile (technical tables)
   - Rows are compact strings separated by ";"  (e.g. "9008*;90;66.65;0.8;100")
     A trailing "*" on the article number = available in standard horns
     configuration (punches) / pneumatic version (hemming dies).
   - Product pages call renderSeries('<category key>') from main.js.

   TO ADD A PROFILE: copy any S(...) line, change the code/cat/rows.
   NO PRICES are stored anywhere – every product is "Price on Request".
   ===================================================================== */
(function (root) {
  'use strict';

  var SECT = '835 mm solid ; 415 mm solid ; 805 mm sectioned';
  var SECT_SOLID = '835 mm solid ; 415 mm solid';

  /* Material grades (catalogue page 03) */
  var materials = {
    ECO: { grade: 'ECONOMY', steel: 'C45', strength: '650 / 680 N/mm²', color: '#9CA3AF' },
    PRD: { grade: 'PRODUCTION', steel: 'C45 quenched', strength: '800 / 850 N/mm²', color: '#E5DCC5' },
    PRO: { grade: 'PROFESSIONAL', steel: 'Cr42Mo4', strength: '1000 / 1100 N/mm²', color: '#4F81BD' }
  };

  var series = {};
  var order = [];
  /* S(code, categoryKey, options) – registers one catalogue profile */
  function S(code, cat, o) {
    o.code = code;
    o.cat = cat;
    o.sections = o.sections || SECT;
    o.rows = o.rows.map(function (r) { return r.split(';'); });
    series[code] = o;
    order.push(code);
  }

  var PCOLS = ['Art. N', 'Angle', 'H', 'R', 'Max t/m'];
  var TCOLS = ['Art. N', 'Angle', 'V', 'W', 'Rext', 'Rint', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'];
  var TXCOLS = ['Art. N', 'Angle', 'V', 'W', 'Rext', 'X', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'];

  /* ---------------- KMC GENERAL PUNCHES ---------------- */
  S('KGP-001', 'punches', { mat: 'ECO', width: 26, weight: '11 | 4.5 kg', cols: PCOLS, horn: true,
    rows: ['9008*;90;66.65;0.8;100', '9025*;90;66.60;0.25;100', '8808*;88;66.65;0.8;100', '8830;88;65.50;3.0;100', '8825*;88;66.60;0.25;100', '8508;85;66.60;0.8;100', '8530;85;65.50;3.0;100'] });
  S('KGP-002', 'punches', { mat: 'ECO', width: 26, weight: '10 | 5 kg', cols: PCOLS,
    rows: ['9006;90;66.40;0.6;35', '9025;90;66.35;0.25;35', '8806;88;66.40;0.6;35', '8825;88;66.35;0.25;35'] });
  S('KGP-003', 'punches', { mat: 'ECO', width: 26, weight: '11 | 5 kg', cols: PCOLS,
    rows: ['8808;88;104.65;0.8;100', '8508;85;104.65;0.8;100'] });
  S('KGP-004', 'punches', { mat: 'ECO', width: 26, note: 'Neck width 10 mm', weight: '10 | 5 kg', cols: ['Art. N', 'Angle', 'H', 'X', 'R', 'Max t/m'],
    rows: ['9006;90;99.40;7.9;0.6;50', '9025;90;99.35;7.8;0.25;50', '8806;88;99.40;8;0.6;50', '8825;88;99.35;8;0.25;50'] });
  S('KGP-005', 'punches', { mat: 'PRD', width: 27, note: 'Blade thickness 6 mm', weight: '8 | 4 kg', cols: ['Art. N', 'Angle', 'H1', 'H2', 'R', 'Max t/m'],
    rows: ['9006;90;94.40;62.92;0.6;50', '9025;90;94.35;63.35;0.25;50', '8806;88;99.40;62.92;0.6;50', '8825;88;94.35;63.35;0.25;50'] });
  S('KGP-006', 'punches', { mat: 'ECO', width: 26, weight: '13 | 6 kg', cols: PCOLS,
    rows: ['9008;90;86;0.8;100', '8808;88;86;0.8;100', '8830;88;84.85;3.0;100'] });
  S('KGP-007', 'punches', { mat: 'ECO', width: 36, weight: '12 | 6 kg', cols: PCOLS,
    rows: ['9008;90;66.65;0.8;60', '8808;88;66.65;0.8;60'] });
  S('KGP-008', 'punches', { mat: 'PRO', width: 37, weight: '14 | 7 kg', cols: PCOLS,
    rows: ['9006;90;84.15;0.6;20', '8806;88;84.15;0.6;20'] });
  S('KGP-009', 'punches', { mat: 'PRD', width: 31, weight: '10 | 5 kg', cols: PCOLS,
    rows: ['8806;88;89.7;0.6;30'] });
  S('KGP-010', 'punches', { mat: 'ECO', width: 26, weight: '15.9 | 8 kg', cols: PCOLS,
    rows: ['0508;85;120;0.8;70'] });
  S('KGP-011', 'punches', { mat: 'PRO', width: 33, weight: '14.5 | 7.2 kg', cols: PCOLS,
    rows: ['8506;85;115;0.6;20'] });
  S('KGP-012', 'punches', { mat: 'ECO', width: 26, weight: '9 | 4 kg', cols: PCOLS,
    rows: ['6008;60;67;0.8;80', '6020;60;67;2.0;80'] });
  S('KGP-013', 'punches', { mat: 'ECO', width: 32, weight: '15 | 7 kg', cols: PCOLS,
    rows: ['6008;60;115;0.8;60'] });
  S('KGP-014', 'punches', { mat: 'PRD', width: 27, weight: '9 | 4 kg', cols: PCOLS,
    rows: ['6008;60;115;0.8;50'] });
  S('KGP-015', 'punches', { mat: 'ECO', width: 26, weight: '19 | 9 kg', cols: PCOLS,
    rows: ['6008;60;135;0.8;70'] });
  S('KGP-016', 'punches', { mat: 'ECO', width: 26, weight: '10 | 5 kg', cols: PCOLS,
    rows: ['4505;45;66.40;0.5;80', '4515;45;65.20;1.5;80'] });
  S('KGP-017', 'punches', { mat: 'ECO', width: 26, weight: '11 | 5 kg', cols: PCOLS,
    rows: ['3505;35;80;0.5;70'] });
  S('KGP-018', 'punches', { mat: 'ECO', width: 26, weight: '12 | 6 kg', cols: PCOLS, horn: true,
    rows: ['3508*;35;90;0.8;70', '3515;35;90;1.5;70'] });
  S('KGP-019', 'punches', { mat: 'ECO', width: 27, weight: '10 | 5 kg', cols: PCOLS,
    rows: ['3508;35;85;0.8;100'] });
  S('KGP-020', 'punches', { mat: 'ECO', width: 26, weight: '16 | 8 kg', cols: PCOLS,
    rows: ['3006;30;104;0.6;100', '3030;30;104;3.0;100', '3050;30;104;5.0;100'] });
  S('KGP-021', 'punches', { mat: 'ECO', width: 26, weight: '10 | 5 kg', cols: PCOLS,
    rows: ['3005;30;80;0.5;100', '3030;30;80;3.0;100'] });
  S('KGP-022', 'punches', { mat: 'ECO', width: 26, weight: '15 | 7 kg', cols: PCOLS,
    rows: ['3005;30;105;0.5;50'] });
  S('KGP-023', 'punches', { mat: 'ECO', width: 26, weight: '19 | 9 kg', cols: PCOLS,
    rows: ['3005;30;135;0.5;50'] });
  S('KGP-024', 'punches', { mat: 'PRD', width: 27, weight: '11 | 5 kg', cols: PCOLS,
    rows: ['3006;30;140;0.6;40'] });
  S('KGP-025', 'punches', { mat: 'ECO', width: 26, weight: '25 | 13 kg', cols: PCOLS,
    rows: ['3005;30;200;0.5;50'] });
  S('KGP-026', 'punches', { mat: 'ECO', width: 27, weight: '13.8 | 6 kg', cols: PCOLS,
    rows: ['2610;26;117;1.0;100'] });
  S('KGP-027', 'punches', { mat: 'PRD', width: 26, weight: '16 | 8 kg', cols: PCOLS,
    rows: ['2608;26;117;0.8;100', '2630;26;117;3.0;100'] });
  S('KGP-028', 'punches', { mat: 'PRO', width: 27, weight: '14.5 | 7.2 kg', cols: PCOLS,
    rows: ['2608;26;145;0.8;100'] });

  /* ---------------- KMC GOOSENECK PUNCHES ---------------- */
  S('KGS-001', 'gooseneck', { mat: 'ECO', width: 55, weight: '21 | 10.5 kg', cols: PCOLS,
    rows: ['9008;90;89.65;0.8;60', '9025;90;89.60;0.25;60', '8808;88;89.65;0.8;60', '8830;88;88.50;3.0;60', '8825;88;89.60;0.25;60'] });
  S('KGS-002', 'gooseneck', { mat: 'PRD', width: 55, weight: '21 | 10 kg', cols: PCOLS,
    rows: ['9025;90;89.88;0.25;50', '8808;88;89.65;0.8;50'] });
  S('KGS-003', 'gooseneck', { mat: 'ECO', width: 55, weight: '23 | 11 kg', cols: PCOLS,
    rows: ['9008;90;104.65;0.8;50', '9025;90;104.60;0.25;50', '8808;88;104.65;0.8;50', '8830;88;103.50;3.0;50', '8825;88;104.60;0.25;50', '8508;85;104.60;0.8;50'] });
  S('KGS-004', 'gooseneck', { mat: 'ECO', width: 55, weight: '23 | 11 kg', cols: PCOLS,
    rows: ['9025;90;104.88;0.25;50', '8808;88;104.65;0.8;50'] });
  S('KGS-005', 'gooseneck', { mat: 'PRD', width: 56, weight: '24 | 12 kg', cols: PCOLS,
    rows: ['9008;90;120;0.8;50', '8808;88;120;0.8;50', '8830;88;119.03;3.0;50'] });
  S('KGS-006', 'gooseneck', { mat: 'ECO', width: 66, weight: '25 | 12 kg', cols: PCOLS,
    rows: ['8808;88;104.65;0.8;45'] });
  S('KGS-007', 'gooseneck', { mat: 'ECO', width: 75, weight: '39 | 19 kg', cols: PCOLS,
    rows: ['8808;88;145;0.8;80'] });
  S('KGS-008', 'gooseneck', { mat: 'ECO', width: 75, weight: '41 | 20 kg', cols: PCOLS,
    rows: ['8808;88;165;0.8;60'] });
  S('KGS-009', 'gooseneck', { mat: 'PRD', width: 90, sections: '505 mm solid ; 805 mm sectioned', weight: '805 mm sectioned: 54 kg ; 505 mm solid: 32.5 kg', cols: PCOLS,
    rows: ['8808;88;200;0.8;85', '8830;88;199.03;3.0;85'] });
  S('KGS-010', 'gooseneck', { mat: 'PRO', width: 67, weight: '23 | 11.5 kg', cols: PCOLS,
    rows: ['8508;85;115;0.8;35'] });
  S('KGS-011', 'gooseneck', { mat: 'PRO', width: 60, weight: '26.7 | 13.3 kg', cols: PCOLS,
    rows: ['8515;85;120;1.5;100'] });
  S('KGS-012', 'gooseneck', { mat: 'PRD', width: 52, sections: '505 mm solid ; 805 mm sectioned', weight: '20 | 10 kg', cols: PCOLS,
    rows: ['6008;60;115;0.8;40'] });
  S('KGS-013', 'gooseneck', { mat: 'PRD', width: 56, weight: '23 | 11 kg', cols: PCOLS,
    rows: ['6008;60;130;0.8;40'] });
  S('KGS-014', 'gooseneck', { mat: 'PRD', width: 56, weight: '23 | 11 kg', cols: PCOLS,
    rows: ['6008;60;160;0.8;40'] });
  S('KGS-015', 'gooseneck', { mat: 'PRO', width: 36, weight: '12 | 6 kg', cols: PCOLS,
    rows: ['6008;60;85;0.8;40'] });

  /* ---------------- KMC RADIUS PUNCHES, HOLDERS & INSERTS ---------------- */
  S('KRP-001', 'radius', { mat: 'ECO', width: 36, weight: '14 | 7 kg', cols: PCOLS, rows: ['6060;60;65;6.0;120'] });
  S('KRP-002', 'radius', { mat: 'ECO', width: 32, weight: '25 | 12 kg', cols: PCOLS, rows: ['6010;60;115;10.0;160'] });
  S('KRP-003', 'radius', { mat: 'ECO', width: 32, weight: '40.8 | 20.4 kg', cols: PCOLS, rows: ['6080;60;200;8.0;150'] });
  S('KRP-004', 'radius', { mat: 'ECO', width: 30, weight: '9 | 4 kg', cols: PCOLS, rows: ['4560;45;50;6.0;100'] });
  S('KRP-005', 'radius', { mat: 'ECO', width: 30, weight: '19 | 9 kg', cols: PCOLS, rows: ['4560;45;100;6.0;100'] });
  S('KRP-006H', 'radius', { title: 'Straight holder for inserts', mat: 'ECO', sections: '830 mm solid ; 410 mm solid', weight: '830 mm (S067 / L100): 10 / 13 kg ; 410 mm: 5 / 6 kg', cols: ['Art. N', 'H', 'Max t/m'],
    rows: ['S067;67;100', 'L100;100;100'] });
  S('KRP-007H', 'radius', { title: 'Gooseneck holder for inserts', mat: 'ECO', sections: '830 mm solid ; 410 mm solid', weight: '830 mm (S087 / L115): 16 / 26 kg ; 410 mm: 8 / 13 kg', cols: ['Art. N', 'H', 'Max t/m'],
    rows: ['S087;87;50', 'L115;115;50'] });
  S('KRP-008H', 'radius', { title: 'Universal holder for small radius inserts', mat: 'ECO', sections: SECT_SOLID, weight: '9 | 4 kg', note: 'Side A: radius inserts R3 – R6.5 · Side B: radius inserts R3 – R4.5', cols: ['Art. N', 'H', 'Max t/m'],
    rows: ['6030;60 + 30;50'] });
  S('KRI-009', 'radius', { title: 'Insert adapter', mat: 'ECO', sections: '830 mm solid ; 410 mm solid', weight: '8 | 4 kg', note: 'To use on holders: KRP-006H ; KRP-007H', cols: ['Art. N', 'R', 'Max t/m'],
    rows: ['RS;R3 – R4.5;50', 'RM;R5 – R6.5;50'] });
  S('PRI-010', 'radius', { title: 'Small radius inserts', mat: 'ECO', sections: SECT_SOLID, note: 'To use on holders: KRI-009 ; KRP-008H', cols: ['Art. N', 'R'],
    rows: ['011;R3.0', '012;R4.0', '013;R4.5', '014;R5.0', '015;R5.5', '016;R6.0', '017;R6.5'] });
  S('PRI-011', 'radius', { title: 'Radius inserts R7 – R12', mat: 'ECO', sections: SECT_SOLID, note: 'To use on holders: KRP-006H ; KRP-007H · Gas nitrided inserts on request (code –N)', cols: ['Art. N', 'R', 'H'],
    rows: ['011;R7.0;11.5', '012;R7.5;11.5', '013;R8.0;13.0', '014;R9.0;16.0', '015;R10.0;16.0', '016;R11.0;16.0', '017;R11.5;16.0', '018;R12.0;20.0'] });
  S('KRI-012', 'radius', { title: 'Radius inserts R12.5 – R20', mat: 'ECO', sections: SECT_SOLID, note: 'Slot width 14 mm · To use on holders: KRP-006H ; KRP-007H · Gas nitrided inserts on request (code –N)', cols: ['Art. N', 'R', 'H', 'H2'],
    rows: ['011;R12.5;21.0;16.0', '012;R13.0;23.0;17.0', '013;R14.0;25.0;19.0', '014;R15.0;27.0;20.0', '015;R16.0;28.0;21.0', '016;R17.0;31.5;21.5', '017;R17.5;32.0;22.0', '018;R19.0;32.0;25.0', '019;R20.0;34.0;24.0'] });
  S('KRI-013', 'radius', { title: 'Radius inserts R22.5 – R50', mat: 'ECO', sections: SECT_SOLID, note: 'To use on holders: KRP-006H ; KRP-007H · Gas nitrided inserts on request (code –N)', cols: ['Art. N', 'R', 'H', 'H2'],
    rows: ['011;R22.5;33.0;25.0', '012;R25.0;39.0;29.0', '013;R27.5;44.0;34.0', '014;R30.0;44.0;34.0', '015;R35.0;55.0;45.0', '016;R40.0;55.0;45.0', '017;R45.0;60.0;50.0', '018;R50.0;64.0;53.0'] });
  S('KRI-013F', 'radius', { title: 'Flat insert (KRI-013 type)', mat: 'ECO', sections: SECT_SOLID, note: 'Width 30 mm, slot 14 mm · To use on holders: KRP-006H ; KRP-007H', cols: ['Art. N', 'H'],
    rows: ['011;17.0'] });

  /* ---------------- KMC FLATTENING TOOLS ---------------- */
  S('PFP-001', 'flattening', { title: 'Flattening punch', mat: 'PRD', width: 28, weight: '17/18 | 8/9 kg', cols: ['Art. N', 'Angle', 'H', 'R', 'Thickness max', 'Max t/m'],
    rows: ['2806;28;128;0.6;1.2;80', '2406;24;128;0.6;1.5;80', '2416;24;128;0.6;1.5;80'] });
  S('PFD-001', 'flattening', { title: 'Flattening die', mat: 'PRD', width: 60, weight: '26/27 | 13/14 kg', cols: ['Art. N', 'H', 'R', 'U', 'Max t/m'],
    rows: ['U810;80;1.0;8.1;50', 'U101;80;1.0;10.1;50', 'U121;80;1.0;12.1;50'] });

  /* ---------------- KMC T-DIES (base 60 mm) ---------------- */
  S('PTD-001', 'tdies', { title: 'T-Die H = 80 mm, 90°', mat: 'ECO', cols: TCOLS,
    rows: ['9006;90;6;14;0.4;0.5;13 | 6.5;100', '9008;90;8;14;0.5;0.5;13 | 6.5;100', '9010;90;10;18;0.6;0.5;15 | 7.5;100', '9012;90;12;18;0.8;0.5;15 | 7.5;100', '9016;90;16;24;1.0;0.5;18 | 9.0;100'] });
  S('PTD-002', 'tdies', { title: 'T-Die H = 80 mm, 88°', mat: 'ECO', cols: TCOLS,
    rows: ['8806;88;6;14;0.4;0.5;13 | 6.5;100', '8808;88;8;14;0.5;0.5;13 | 6.5;100', '8810;88;10;18;0.6;0.5;15 | 7.5;100', '8812;88;12;18;2.75;0.5;15 | 7.5;100', '8816;88;16;24;2.75;0.5;16 | 8.0;100', '8820;88;20;30;3.0;0.5;19 | 9.5;100', '8825;88;25;35;3.0;0.5;20 | 10.0;100'] });
  S('PTD-003', 'tdies', { title: 'T-Die H = 80 mm, 85°', mat: 'ECO', cols: TCOLS,
    rows: ['8506;85;6;14;0.4;0.5;13 | 6.0;100', '8508;85;8;14;0.5;0.5;13 | 6.0;100', '8510;85;10;18;0.6;0.5;15 | 7.0;100', '8512;85;12;18;2.75;0.5;15 | 7.0;100', '8516;85;16;24;2.75;0.5;18 | 9.0;100', '8520;85;20;30;3.0;0.5;19 | 9.0;100', '8525;85;25;35;3.0;0.5;20 | 10.0;100'] });
  S('PTD-004', 'tdies', { title: 'T-Die H = 80 mm, 60°', mat: 'ECO', cols: TCOLS,
    rows: ['6006;60;6;14;0.4;0.5;13 | 6.5;60', '6008;60;8;14;0.5;0.5;13 | 6.5;60', '6010;60;10;18;0.6;0.5;15 | 7.5;60', '6012;60;12;18;0.8;0.5;15 | 7.5;75', '6016;60;16;24;3.0;0.7;18 | 9.0;70', '6020;60;20;30;3.0;0.7;19 | 9.5;65', '6025;60;25;35;3.0;1.0;20 | 10.0;60'] });
  S('PTD-005', 'tdies', { title: 'T-Die H = 80 mm, 45°', mat: 'ECO', cols: TCOLS,
    rows: ['4506;45;6;14;0.6;0.5;13 | 6.5;50', '4508;45;8;18;0.8;0.5;15 | 7.5;50', '4510;45;10;18;1.0;0.7;15 | 7.5;50', '4512;45;12;24;1.5;0.7;18 | 9.0;50', '4516;45;16;24;2.0;1.0;18 | 9.0;50', '4520;45;20;30;2.5;1.0;19 | 9.5;50', '4525;45;25;35;3.0;1.0;20 | 10.0;50'] });
  S('PTD-006', 'tdies', { title: 'T-Die H = 80 mm, 30°', mat: 'ECO', cols: TXCOLS,
    rows: ['3006;30;6;14;0.6;R1;13 | 6.5;35', '3008;30;8;18;0.8;2.0;15 | 7.5;40', '3010;30;10;24;1.0;2.0;18 | 9.0;50', '3012;30;12;24;1.5;2.0;18 | 9.0;50', '3016;30;16;30;2.0;5.0;19 | 9.5;50', '3020;30;20;35;2.5;5.0;20 | 10.0;55', '3025;30;25;40;3.0;5.0;21 | 10.5;55'] });
  S('PTD-007', 'tdies', { title: 'T-Die H = 120 mm, 90°', mat: 'ECO', cols: TCOLS,
    rows: ['9006;90;6;14;0.4;0.5;16 | 8.0;100', '9008;90;8;14;0.5;0.5;16 | 8.0;100', '9010;90;10;18;0.6;0.5;18 | 9.0;100', '9012;90;12;18;0.8;0.5;18 | 9.0;100', '9016;90;16;24;1.0;0.5;22 | 11.0;100'] });
  S('PTD-008', 'tdies', { title: 'T-Die H = 120 mm, 88°', mat: 'ECO', cols: TCOLS,
    rows: ['8806;88;6;14;0.4;0.5;16 | 8.0;100', '8808;88;8;14;0.5;0.5;16 | 8.0;100', '8810;88;10;18;0.6;0.5;18 | 9.0;100', '8812;88;12;18;2.75;0.5;18 | 9.0;100', '8816;88;16;24;2.75;0.5;22 | 11.0;100', '8820;88;20;30;3.0;0.5;27 | 13.5;100', '8825;88;25;35;3.0;0.5;30 | 15.0;100'] });
  S('PTD-009', 'tdies', { title: 'T-Die H = 120 mm, 85°', mat: 'ECO', cols: TCOLS,
    rows: ['8506;85;6;14;0.4;0.5;17 | 8.0;100', '8508;85;8;14;0.5;0.5;17 | 8.0;100', '8510;85;10;18;0.6;0.5;18 | 9.0;100', '8512;85;12;18;2.75;0.5;18 | 9.0;100', '8516;85;16;24;2.75;0.5;22 | 11.0;100', '8520;85;20;30;3.0;0.5;27 | 13.5;100', '8525;85;25;35;3.0;0.5;30 | 15.0;100'] });
  S('PTD-010', 'tdies', { title: 'T-Die H = 120 mm, 60°', mat: 'ECO', cols: TCOLS,
    rows: ['6006;60;6;14;0.4;0.5;16 | 8.0;60', '6008;60;8;14;0.5;0.7;16 | 8.0;60', '6010;60;10;18;0.6;0.5;18 | 9.0;60', '6012;60;12;18;0.8;0.5;18 | 9.0;75', '6016;60;16;24;3.0;0.7;22 | 11.0;70', '6020;60;20;30;3.0;0.7;27 | 13.5;65', '6025;60;25;35;3.0;1.0;28 | 14.0;60'] });
  S('PTD-011', 'tdies', { title: 'T-Die H = 120 mm, 45°', mat: 'ECO', cols: TCOLS,
    rows: ['4506;45;6;14;0.6;0.5;17 | 8.5;50', '4508;45;8;18;0.8;0.5;18 | 9.0;50', '4510;45;10;18;1.0;0.7;18 | 9.0;50', '4512;45;12;24;1.5;0.7;22 | 11.0;50', '4516;45;16;24;2.0;1.0;22 | 11.0;50', '4520;45;20;30;2.5;1.0;27 | 13.5;50', '4525;45;25;35;3.0;1.0;30 | 15.0;50'] });
  S('PTD-012', 'tdies', { title: 'T-Die H = 120 mm, 30°', mat: 'ECO', cols: TXCOLS,
    rows: ['3006;30;6;14;0.6;R1;17 | 8.5;35', '3008;30;8;18;0.8;2.0;18 | 9.0;40', '3010;30;10;24;1.0;2.0;22 | 11.0;50', '3012;30;12;24;1.5;2.0;22 | 11.0;50', '3016;30;16;30;2.0;5.0;27 | 13.5;50', '3020;30;20;35;2.5;5.0;30 | 15.0;55', '3025;30;25;40;3.0;5.0;33 | 16.5;55'] });

  /* ---------------- KMC MULTI-V DIES (60 x 60) ---------------- */
  var MVCOLS = ['Art. N', 'Angle', 'V', 'Max t/m'];
  S('PMD-001', 'multiv', { title: '4-way die 88° / 85°', mat: 'ECO', width: 60, weight: '16 | 8 kg', cols: MVCOLS,
    rows: ['8885;88 / 85;16 | 22 (88°) · 35 | 50 (85°);80'] });
  S('PMD-002', 'multiv', { title: '4-way die 85°', mat: 'ECO', width: 60, weight: '16 | 8 kg', cols: MVCOLS, rows: ['85MV;85;16 | 22 | 35 | 50;80'] });
  S('PMD-003', 'multiv', { title: '4-way die 60°', mat: 'ECO', width: 60, weight: '18 | 9 kg', cols: MVCOLS, rows: ['60MV;60;10 | 16 | 22 | 35;60'] });
  S('PMD-004', 'multiv', { title: '2-way die 90° V6 / V10', mat: 'ECO', width: 60, weight: '20 | 10 kg', cols: MVCOLS, rows: ['90MV;90;6 | 10;80'] });
  S('PMD-005', 'multiv', { title: '2-way die 90° V8 / V12', mat: 'ECO', width: 60, weight: '20 | 10 kg', cols: MVCOLS, rows: ['90MV;90;8 | 12;80'] });
  S('PMD-006', 'multiv', { title: '3-way U-die', mat: 'ECO', width: 60, weight: '20 | 10 kg', cols: ['Art. N', 'U', 'Max t/m'], rows: ['U3MV;6 | 10 | 18;100'] });

  /* ---------------- KMC SINGLE-V DIES ---------------- */
  S('PSD-001', 'singlev', { title: 'Single-V die, base 60 mm', mat: 'ECO', width: 60, cols: ['Art. N', 'Angle', 'V', 'H', 'Rext', 'Rint', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'],
    rows: ['8532;85;32;60;4.0;2.0;22 | 11.0;100', '8540;85;40;60;4.0;2.0;21 | 10.0;100', '8550;85;50;60;4.0;2.0;19 | 9.5;80', '4532;45;32;80;4.0;2.5;28 | 14.0;100'] });
  S('PSD-002', 'singlev', { title: 'Acute single-V die, H 60 mm', mat: 'ECO', width: 60, cols: ['Art. N', 'Angle', 'V', 'Rext', 'X', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'],
    rows: ['3018;30;18;2.0;5.0;22 | 11.0;100', '3025;30;25;3.0;8.0;23 | 11.0;100'] });
  S('PSD-003', 'singlev', { title: 'Heavy-duty single-V die', mat: 'ECO', sections: SECT + ' (art. 7022: 505 mm sectioned only)', cols: ['Art. N', 'Angle', 'V', 'H', 'H2', 'Rext', 'Rint', 'W1', 'W2', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'],
    rows: ['8563;85;63;75;20;6.0;6.0;60;80;28.5 | 15.0;100', '8580;85;80;80;20;6.0;8.0;60;95;38 | 19.0;100', '8010;80;100;95;20;7.0;10.0;60;120;50 | 25.0;120', '8012;80;125;103;20;9.0;32.0;60;154;70 | 35.0;120', '8016;80;160;130;20;11.0;38.0;60;185;91 | 51.0;120', '7022;70;220;190;20;10.0;75.0;90;260;505 sect.: 119;200', '6050;60;50;75;20;5.0;4.0;60;75;28 | 14.0;100', '6063;60;63;86;20;5.0;4.0;60;86;34 | 17.0;100', '6080;60;80;115;20;6.0;10.0;60;115;60 | 30.0;100', '4540;45;40;75;20;4.0;2.5;60;75;33 | 16.0;100', '4550;45;50;95;20;6.0;10.0;60;95;34 | 17.0;100', '4563;45;63;105;20;8.0;14.0;60;105;36 | 18.0;100', '4580;45;80;145;20;6.0;10.0;60;145;102 | 51.0;100'] });

  /* ---------------- KMC SINGLE-V INSERT DIES ---------------- */
  S('PSD-004H', 'insert', { title: 'Holder for inserts (with PU insert)', mat: 'ECO', width: 60, sections: SECT_SOLID, weight: '17 | 8 kg', cols: ['Art. N', 'H', 'W'], rows: ['UN01;51.5 | 61.5;60'] });
  var ICOLS = ['Art. N', 'Angle', 'V', 'W', 'Rext', 'Rint', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'];
  S('PDI-001', 'insert', { title: 'Die insert 88°, H 60 mm', mat: 'ECO', note: 'To use on holder: PSD-004H', cols: ICOLS,
    rows: ['8804;88;4;14;0.6;0.5;5 | 2.0;100', '8806;88;6;14;0.8;0.5;5 | 2.0;100', '8808;88;8;14;1.0;0.5;5 | 2.0;100', '8810;88;10;18;1.2;0.5;6 | 3.0;100', '8812;88;12;18;1.5;0.5;6 | 3.0;100', '8816;88;16;24;2.0;0.5;8 | 4.0;100', '8820;88;20;30;2.0;0.5;9 | 4.0;100', '8825;88;25;35;3.0;0.5;10 | 5.0;100'] });
  S('PDI-002', 'insert', { title: 'Die insert 60°, H 60 mm', mat: 'ECO', note: 'To use on holder: PSD-004H', cols: ICOLS,
    rows: ['6006;60;6;14;0.6;0.7;5.4 | 2.7;100', '6008;60;8;14;0.8;0.7;5.4 | 2.7;100', '6010;60;10;18;1.0;0.7;6.4 | 3.2;100', '6012;60;12;18;1.2;0.7;6.2 | 3.1;100', '6016;60;16;24;1.6;0.7;7.7 | 3.9;100', '6020;60;20;30;2.0;0.7;9.0 | 4.5;100', '6025;60;25;35;2.5;0.7;10 | 5.0;100'] });
  S('PDI-003', 'insert', { title: 'Die insert 30°, H 60 mm', mat: 'ECO', note: 'To use on holder: PSD-004H', cols: ['Art. N', 'Angle', 'V', 'W', 'Rext', 'X', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'],
    rows: ['3006;30;6;14;0.6;R1.0;5 | 2.0;35', '3008;30;8;14;0.8;2.0;6 | 3.0;40', '3010;30;10;24;1.0;2.0;8 | 4.0;50', '3012;30;12;24;1.5;2.0;7 | 3.0;50', '3016;30;16;30;2.0;5.0;9 | 4.0;50', '3020;30;20;35;2.5;5.0;9 | 4.0;55', '3025;30;25;45;3.0;10.0;13 | 6.0;55'] });

  /* ---------------- KMC NYLON & POLYURETHANE DIES ---------------- */
  var HCOLS = ['Art. N', 'H', 'W'];
  var NCOLS = ['Art. N', 'Angle', 'Available V openings'];
  S('PND-001H', 'nylon', { title: 'Holder for nylon inserts (slot 14 mm)', mat: 'ECO', width: 60, sections: SECT_SOLID, weight: '15 | 7 kg', cols: HCOLS, rows: ['UN01;75;60'] });
  S('PNI-010', 'nylon', { title: 'Nylon inserts for PND-001H', mat: 'ECO', matLabel: 'Nylon', note: 'Insert section 24 × 20 mm', cols: NCOLS,
    rows: ['88-X;88;6 · 8 · 10', '60-X;60;6 · 8 · 10', '45-X;45;6 · 8 · 10', '30-X;30;6 · 8'] });
  S('PND-002H', 'nylon', { title: 'Holder for nylon inserts (slot 20 mm)', mat: 'ECO', width: 60, sections: SECT_SOLID, weight: '15 | 7 kg', cols: HCOLS, rows: ['UN02;75;60'] });
  S('PNI-011', 'nylon', { title: 'Nylon inserts for PND-002H', mat: 'ECO', matLabel: 'Nylon', note: 'Insert section 35 × 24 mm', cols: NCOLS,
    rows: ['88-X;88;6 · 8 · 10 · 12 · 16', '60-X;60;6 · 8 · 10 · 12 · 16', '45-X;45;6 · 8 · 10 · 12', '30-X;30;6 · 8 · 10'] });
  S('PND-003H', 'nylon', { title: 'Holder for nylon inserts (slot 30 mm)', mat: 'ECO', width: 60, sections: SECT_SOLID, weight: '15 | 7 kg', cols: HCOLS, rows: ['UN03;79;60'] });
  S('PNI-012', 'nylon', { title: 'Nylon inserts for PND-003H', mat: 'ECO', matLabel: 'Nylon', note: 'Insert section 38 × 31 mm', cols: NCOLS,
    rows: ['88-X;88;6 · 8 · 10 · 12 · 16 · 20 · 25', '60-X;60;6 · 8 · 10 · 12 · 16 · 20', '45-X;45;6 · 8 · 10 · 12 · 16 · 20', '30-X;30;6 · 8 · 10 · 12 · 16'] });
  var PUCOLS = ['Art. N', 'H', 'W', 'PU insert (solid)', 'PU insert (hollow)'];
  S('PPD-001H', 'nylon', { title: 'Holder for PU inserts 25 × 25', mat: 'ECO', sections: SECT_SOLID, weight: '19 | 9 kg', cols: PUCOLS, rows: ['UN60;60;60;PPI-23S (25 × 25);PPI-23H (25 × 25, Ø10)'] });
  S('PPD-002H', 'nylon', { title: 'Holder for PU inserts 50 × 50', mat: 'ECO', sections: SECT_SOLID, weight: '37 | 18 kg', cols: PUCOLS, rows: ['UN96;96;96;PPI-21S (50 × 50);PPI-21H (50 × 50, Ø25)'] });
  S('PPD-003H', 'nylon', { title: 'Holder for PU inserts 75 × 50', mat: 'ECO', sections: SECT_SOLID, weight: '45 | 22 kg', cols: PUCOLS, rows: ['UN12;100;125;PPI-22S (75 × 50);PPI-23H (75 × 50, slot 45 × 20)'] });
  S('PPD-004H', 'nylon', { title: 'Holder for PU inserts 100 × 50', mat: 'ECO', sections: SECT_SOLID, weight: '55 | 27 kg', cols: PUCOLS, rows: ['UN15;100;155;PPI-23S (100 × 50);PPI-23H (100 × 50, slot 60 × 20)'] });

  /* ---------------- KMC HEMMING DIES ---------------- */
  var HMCOLS = ['Art. N', 'Angle', 'V', 'Hmax', 'Rext', 'Max S (thickness)', 'Weight 835 | 415 mm (kg)', 'Max t/m'];
  S('PHD-001', 'hemming', { title: 'Spring hemming die', mat: 'ECO', matLabel: 'C45 main body · C45 quenched bottom', width: 60, pneumatic: true, cols: HMCOLS,
    rows: ['3506*;35;6;105;1.0;1.0;32 | 16.0;80', '3008*;30;8;110;1.0;1.5;34 | 17.0;80'] });
  S('PHD-002', 'hemming', { title: 'Compact spring hemming die', mat: 'ECO', matLabel: 'C45 main body · C45 quenched bottom', width: 60, cols: HMCOLS,
    rows: ['3506;35;6;100.7;1.0;1.0;34 | 17.0;60', '3508;35;8;100.7;1.0;1.2;34 | 17.0;60'] });
  S('PHD-003', 'hemming', { title: 'Heavy spring hemming die', mat: 'ECO', matLabel: 'C45 main body · C45 quenched bottom', width: 60, pneumatic: true, cols: HMCOLS,
    rows: ['2610*;26;10;135;1.5;2.5;42 | 21.0;100', '2612*;26;12;135;3.0;3.0;42 | 21.0;100'] });

  /* ---------------- KMC 2-V (SELF-CENTERING) DIES ---------------- */
  var D2COLS = ['Art. N', 'Angle', 'V1', 'V2', 'W1', 'W2', 'R1ext', 'R2ext', 'Rint', 'Weight 835 | 415 mm (kg)', 'Max t/m'];
  S('PDD-001H', '2v', { title: 'Holder for 2-V dies', mat: 'ECO', width: 60, sections: SECT_SOLID, cols: ['Art. N', 'H', 'H2', 'W', 'Weight 835 | 415 mm (kg)'],
    rows: ['UN01;60;34;60;9 | 4.5', 'UN02;65;39;60;12 | 6.0', 'UN03;55;81;60;15 | 7.5', 'UN04;75;101;60;19 | 9.0'] });
  S('PDD-002', '2v', { title: '2-V die H 26 mm, 90°', mat: 'ECO', width: 55, sections: SECT_SOLID, note: 'To use on holder: PDD-001H', cols: D2COLS,
    rows: ['9004;90;4;7;4;7;0.3;0.5;0.5;9 | 4.0;100', '9006;90;6;10;6;10;0.4;0.6;0.5;9 | 4.0;100', '9008;90;8;12;8;10;0.5;0.8;0.5;9 | 4.0;100'] });
  S('PDD-003', '2v', { title: '2-V die H 26 mm, 88°', mat: 'ECO', width: 55, sections: SECT_SOLID, note: 'To use on holder: PDD-001H', cols: D2COLS,
    rows: ['8806;88;6;10;6;10;0.8;1.2;0.5;9 | 4.5;100', '8808;88;8;12;8;10;1.0;1.5;0.5;9 | 4.5;100', '8812;88;12;20;10;15;2.75;3.0;0.5;9 | 4.5;100', '8814;88;14;18;11;13;2.75;3.0;0.5;9 | 4.5;100', '8816;88;16;25;12;16.5;2.75;3.0;0.5;8 | 4.0;100'] });
  S('PDD-004', '2v', { title: '2-V die H 26 mm, 60°', mat: 'ECO', width: 55, sections: SECT_SOLID, note: 'To use on holder: PDD-001H', cols: D2COLS,
    rows: ['6006;60;6;10;6;10;0.4;0.6;0.5;8 | 4.0;60', '6008;60;8;12;8;10;0.8;1.2;0.7;8 | 4.0;60', '6012;60;12;20;10;15;0.8;1.5;0.7;8 | 4.0;60', '6016;60;16;20;12;15;1.6;2.0;0.7;8 | 4.0;60'] });
  S('PDD-005', '2v', { title: '2-V die H 46 mm, 30°', mat: 'ECO', width: 50, sections: SECT_SOLID, note: 'To use on holder: PDD-001H', cols: ['Art. N', 'Angle', 'V1', 'V2', 'W1', 'W2', 'R1ext', 'R2ext', 'X1 | X2', 'Weight 835 | 415 mm (kg)', 'Max t/m'],
    rows: ['3008;30;8;12;9.5;14.5;0.8;1.5;2;13 | 6.5;40'] });
  S('PDD-006H', '2v', { title: 'Adapter holder for 2-V dies (+ PDS-001 stopper)', mat: 'ECO', sections: SECT_SOLID, note: 'To use on holder: PDD-001H · Stopper art. N: PDS-001', cols: ['Art. N', 'H', 'W', 'Weight 835 | 415 mm (kg)'],
    rows: ['UN01;15;50;4 | 2.0', 'UN02;25;60;8 | 4.0'] });
  var D2BCOLS = ['Art. N', 'Angle', 'V1', 'V2', 'W1', 'W2', 'R1ext', 'R2ext', 'R1int', 'R2int', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'];
  S('PDD-007', '2v', { title: '2-V die H 46 mm, 90°', mat: 'ECO', width: 39, note: 'To use on holder: PDD-006H', cols: D2BCOLS,
    rows: ['9004;90;4;7;3.5;5.0;0.3;0.5;0.5;0.5;9 | 4.5;80', '9006;90;6;10;4.5;6.5;0.4;0.6;0.5;0.5;10 | 5.0;80', '9008;90;8;12;5.5;7.5;0.5;0.6;0.5;0.8;11 | 5.5;80'] });
  S('PDD-008', '2v', { title: '2-V die H 46 mm, 88°', mat: 'ECO', width: 39, note: 'To use on holder: PDD-006H', cols: D2BCOLS,
    rows: ['8806;88;6;10;4.5;6.5;0.8;1.2;0.5;0.5;10 | 5.5;80', '8808;88;8;12;5.5;7.5;1.0;1.5;0.5;0.5;11 | 5.5;80', '8814;88;14;18;8.5;10.5;1.25;1.5;0.5;0.5;12 | 6.0;80', '8812;88;12;20;7.5;12;0.8;1.75;0.5;0.5;12 | 6.0;80', '8816;88;16;25;9.5;14.5;1.5;1.75;0.5;0.5;13 | 6.5;80'] });
  S('PDD-009', '2v', { title: '2-V die H 46 mm, 30°', mat: 'ECO', width: 50, note: 'To use on holder: PDD-006H', cols: ['Art. N', 'Angle', 'V1', 'V2', 'W1', 'W2', 'R1ext', 'R2ext', 'X1 | X2', 'Weight 835/805S | 415 mm (kg)', 'Max t/m'],
    rows: ['3006;30;6;10;7;12;0.6;1.0;R1 | X=2;13 | 6.5;40', '3008;30;8;12;9.5;14.5;0.8;1.5;2;13 | 6.5;40'] });

  /* ---------------- KMC Z-BEND / JOGGLE DIES ---------------- */
  S('PZD-001H', 'zbend', { title: 'Z-bend holder set (upper + lower)', mat: 'ECO', sections: SECT_SOLID, weight: '38 | 19 kg', note: 'Art. N UN01 includes both upper and lower part', cols: ['Art. N', 'Upper H', 'Upper W', 'Lower H', 'Lower W'],
    rows: ['UN01;66;60;60;60'] });
  S('PZI-001', 'zbend', { title: 'Z-bend inserts', mat: 'ECO', sections: SECT_SOLID, note: 'To use on holder: PZD-001H · X = offset (step height)', cols: ['Art. N', 'Angle', 'H', 'W1', 'W2', 'X', 'Weight 835 | 415 mm (kg)', 'Max thickness (mm)'],
    rows: ['1610;160;36;23;23;1.0;10 | 5.0;0.5', '1615;160;36;23;23;1.5;10 | 5.0;0.6', '1520;150;36;23;23;2.0;10 | 5.0;0.8', '1425;140;36;23;23;2.5;10 | 5.0;1.0',
      '9001;90;36;23;23;1.0;10 | 5.0;0.5', '9015;90;36;23;23;1.5;10 | 5.0;0.6', '9020;90;36;23;23;2.0;10 | 5.0;0.8', '9025;90;36;23;23;2.5;10 | 5.0;1.0', '9030;90;36;23;23;3.0;10 | 5.0;1.0',
      '9035;90;36;23;23;3.5;10 | 5.0;1.2', '9040;90;36;23;23;4.0;10 | 5.0;1.2', '9045;90;36;23;23;4.5;10 | 5.0;1.5', '9050;90;36;23;23;5.0;10 | 5.0;1.5', '9055;90;36;23;23;5.5;10 | 5.0;1.5',
      '9060;90;36;23;23;6.0;10 | 5.0;1.5', '9065;90;36;23;23;6.5;10 | 5.0;1.5', '9070;90;36;23;23;7.0;10 | 5.0;2.0', '9075;90;36;23;23;7.5;10 | 5.0;2.0', '9080;90;36;23;23;8.0;10 | 5.0;2.5',
      '9090;90;45;23;27;9.0;13.5 | 6.7;2.5', '9010;90;45;23;27;10.0;13.5 | 6.7;3.0', '9011;90;45;23;27;11.0;13.5 | 6.7;3.0', '9012;90;45;23;27;12.0;13.5 | 6.7;3.0',
      '9013;90;45;23;32;13.0;14.5 | 7.3;3.0', '9014;90;45;23;32;14.0;14.5 | 7.3;3.0', '9016;90;45;23;32;15.0;14.5 | 7.3;3.0'] });

  /* ---------------- KMC DIE HOLDERS, PUNCH HOLDERS & CLAMPS ---------------- */
  S('PDH-001', 'holders', { title: 'Die holder rail (width 97 mm)', mat: 'ECO', sections: 'Lengths as listed', cols: ['Art. N', 'L', 'H', 'Weight'],
    rows: ['UN01;2100 mm;27;27 kg', 'UN02;2600 mm;27;34 kg', 'UN03;3100 mm;27;40 kg', 'UN04;4100 mm;27;53 kg'] });
  S('PDH-002', 'holders', { title: 'Die holder with clamp blocks', mat: 'ECO', sections: '835 mm solid', cols: ['Art. N', 'Configuration', 'H', 'Weight'],
    rows: ['UN01;6 × clamp blocks L = 150 mm;55 + 12;22 kg', 'UN02;2 × clamp blocks L = 800 mm;55 + 12;28 kg'] });
  S('PCL-003', 'holders', { title: 'Punch clamp (screw type)', mat: 'ECO', sections: 'L = 150 mm', cols: ['Art. N', 'L', 'H', 'Weight'],
    rows: ['UN01;150 mm;63;0.8 kg', 'UN02 (with PU insert);150 mm;58;0.8 kg'] });
  S('PCL-004', 'holders', { title: 'Punch clamp (quick lever type)', mat: 'ECO', sections: 'L = 150 mm', cols: ['Art. N', 'L', 'H', 'Weight'],
    rows: ['UN01;150 mm;58;0.8 kg', 'UN02 (with PU insert);150 mm;58;0.8 kg'] });

  /* =====================================================================
     PRODUCT CATEGORIES – used for menus, cards and product page text.
     "draw" chooses the built-in SVG line drawing used as placeholder art.
     ===================================================================== */
  var categories = [
    { key: 'punches', slug: 'press-brake-punches', title: 'Press Brake Punches', menu: 'Press Brake Punches (General)', draw: 'punch',
      short: 'Straight, acute and sash punches from 26° to 90° for everyday air bending.',
      seo: 'Press Brake Punch Manufacturer in Pune',
      intro: 'Our KMC / EURO style general punches cover the bends that make up most of a fabrication shop’s daily work – from 90° and 88° standard profiles to slim 30° and 26° acute punches for overbending and hemming preparation. Every profile is machined on CNC equipment, induction hardened on the working tip and ground to a consistent height so sectioned pieces line up perfectly along the beam.',
      types: ['Standard 90° / 88° / 85° punches (H 66 – 120 mm)', 'Slim and sash punches with 6 – 14 mm blades', '60° and 45° punches for closed profiles', 'Acute 35°, 30° and 26° punches up to H 200 mm', 'Horn sections (left / right) for box bending'],
      features: ['Induction hardened tip: 55 – 60 HRC, 3 – 4 mm deep', 'KMC / EURO tang – fits 50+ press brake brands', 'Available in 835 mm, 415 mm solid and 805 mm sectioned sets', 'Tip radii from R0.25 to R5.0', 'Load ratings up to 100 t/m'] },
    { key: 'gooseneck', slug: 'gooseneck-punches', title: 'Gooseneck Punches', menu: 'Gooseneck Punches', draw: 'gooseneck',
      short: 'Deep relief necks for U-channels, return flanges and box sections.',
      seo: 'Gooseneck Punch Manufacturer in Pune',
      intro: 'Gooseneck punches carry a deep relief behind the working tip so tall return flanges clear the punch body. Use them for channels, door frames, cabinet returns and any part where a straight punch would collide with an already-formed flange. Heights range from 85 mm to 200 mm with throat widths from 36 mm to 90 mm.',
      types: ['Standard goosenecks H 89 – 120 mm', 'Large-throat goosenecks H 145 – 200 mm', '60° goosenecks for acute returns', 'Cr42Mo4 professional-grade goosenecks for heavy work'],
      features: ['Optimised neck geometry for maximum clearance', 'Induction hardened working tip', 'Three material grades to suit load and budget', 'Supplied solid or sectioned for flexible set-ups', 'Ratings up to 100 t/m (KGS-011)'] },
    { key: 'radius', slug: 'radius-tools', title: 'Radius Punches, Holders & Inserts', menu: 'Radius Punches, Holders & Inserts', draw: 'radius',
      short: 'Fixed radius punches plus a modular holder & insert system from R3 to R50.',
      seo: 'Press Brake Radius Tool Manufacturer in Pune',
      intro: 'For large inside radii, choose a solid radius punch (R6 – R10) or build any radius from R3 to R50 using our modular holders and interchangeable inserts. One holder serves a whole family of inserts, so you can stock many radii at a fraction of the cost of separate punches.',
      types: ['Solid radius punches KRP-001 – KRP-005', 'Straight and gooseneck insert holders (KRP-006H / 007H)', 'Universal two-sided holder for small radii (KRP-008H)', 'Radius inserts R3 – R50 (PRI / KRI series)', 'Gas nitrided inserts on request (code –N)'],
      features: ['Quick insert change – no need to remove the holder', 'Ratings up to 160 t/m on solid radius punches', 'Precise radius geometry for consistent springback', 'Inserts sold in 835 mm and 415 mm lengths'] },
    { key: 'hemming', slug: 'hemming-tools', title: 'Hemming Tools', menu: 'Hemming Tools', draw: 'hemming',
      short: 'Spring-loaded hemming dies that pre-bend and flatten in one set-up.',
      seo: 'Press Brake Hemming Tool Manufacturer in Pune',
      intro: 'Our spring hemming dies combine an acute V for the pre-bend with a sprung flattening jaw, so you can form open and closed hems without changing tools. They are ideal for safe edges on panels, enclosures, appliances and HVAC ducting.',
      types: ['PHD-001 spring hemming die, V6 / V8', 'PHD-002 compact hemming die, H 100.7 mm', 'PHD-003 heavy hemming die for up to 3 mm sheet', 'Pneumatic versions of PHD-001 and PHD-003 on request'],
      features: ['Two operations in one tool – faster cycle times', 'C45 body with quenched C45 bottom jaw', 'Handles sheet from 1.0 mm up to 3.0 mm', 'Ratings up to 100 t/m'] },
    { key: 'flattening', slug: 'flattening-tools', title: 'Flattening Tools', menu: 'Flattening Tools', draw: 'flatten',
      short: 'Matched acute punch and U-die sets for pre-bend and flattening.',
      seo: 'Press Brake Flattening Tool Manufacturer in Pune',
      intro: 'Flattening sets pair a slim 24° / 28° punch with a U-slot die. The punch makes the acute pre-bend; the flat die face then closes the hem. Because the punch blade sits inside the die slot, the tools stay aligned and the hem is flattened evenly over the full length.',
      types: ['PFP-001 flattening punches 28° / 24°, H 128 mm', 'PFD-001 U-dies with slot 8.1 / 10.1 / 12.1 mm'],
      features: ['C45 quenched for wear resistance', 'Matched punch-die pairs', 'For sheet up to 1.5 mm', 'Ratings up to 80 t/m'] },
    { key: 'tdies', slug: 't-dies', title: 'T-Dies', menu: 'T-Dies', draw: 'tdie',
      short: 'Single-V T-dies, H 80 & 120 mm, V4 to V25, angles 30° – 90°.',
      seo: 'Press Brake T-Die (V-Die) Manufacturer in Pune',
      intro: 'T-dies are the workhorse lower tools for thin and medium sheet. The narrow body gives excellent clearance for return flanges, while the 60 mm base sits securely in standard die holders. Choose 80 mm or 120 mm heights in 90°, 88°, 85°, 60°, 45° and 30° angles.',
      types: ['H 80 mm T-dies (PTD-001 – PTD-006)', 'H 120 mm T-dies (PTD-007 – PTD-012)', 'V openings from 6 to 25 mm', 'Acute 30° dies with relief slot for hemming'],
      features: ['Ground V-flanks with defined Rext / Rint', 'Induction hardened V-edges', 'Base 60 mm, fits standard die rails', 'Ratings up to 100 t/m'] },
    { key: 'multiv', slug: 'multi-v-dies', title: 'Multi-V Dies', menu: 'Multi-V Dies', draw: 'multiv',
      short: 'Two-, three- and four-way dies – several V openings in one block.',
      seo: 'Multi V Die Manufacturer in Pune',
      intro: 'Multi-V dies put two, three or four V openings in a single 60 × 60 mm block. Rotate the die to change V width – a compact, economical solution for job shops that bend many thicknesses on one machine.',
      types: ['4-way 88° / 85° die V16 – V50', '4-way 85° die V16 – V50', '4-way 60° die V10 – V35', '2-way 90° dies V6/V10 and V8/V12', '3-way U-die U6 / U10 / U18'],
      features: ['One block replaces up to four dies', 'Solid C45 body', 'Ratings up to 100 t/m', 'Sectioned sets available'] },
    { key: 'singlev', slug: 'single-v-dies', title: 'Single-V Dies', menu: 'Single-V Dies', draw: 'vdie',
      short: 'Heavy single-V dies from V18 to V220 for thick plate.',
      seo: 'Press Brake Single V Die Manufacturer in Pune',
      intro: 'For thick plate and high tonnage we offer solid single-V dies from V18 up to V220. Wide bases and generous shoulder radii spread the load and protect the sheet surface, with ratings up to 200 t/m.',
      types: ['PSD-001 85° / 45° dies, V32 – V50', 'PSD-002 30° acute dies, V18 / V25', 'PSD-003 heavy dies 85° – 45°, V40 – V220'],
      features: ['Large shoulder radii reduce marking', 'Ratings from 100 to 200 t/m', 'Stepped base (W1 / W2) for stability', 'Sectioned lengths for most sizes'] },
    { key: 'insert', slug: 'insert-dies', title: 'Single-V Insert Dies', menu: 'Single-V Insert Dies', draw: 'insertdie',
      short: 'Interchangeable 14 mm-tang V inserts in one quick-change holder.',
      seo: 'Single V Insert Die Manufacturer in Pune',
      intro: 'Insert dies separate the wearing part from the holder. A single PSD-004H holder takes 88°, 60° and 30° inserts from V4 to V25 – changing V width is quick and only the small insert is replaced when worn.',
      types: ['PSD-004H holder with PU retaining insert', 'PDI-001 88° inserts V4 – V25', 'PDI-002 60° inserts V6 – V25', 'PDI-003 30° inserts V6 – V25'],
      features: ['Low-cost replacement of worn V', 'Quick change without unclamping the holder', 'Ratings up to 100 t/m'] },
    { key: 'nylon', slug: 'nylon-pu-dies', title: 'Nylon & PU Insert Dies', menu: 'Nylon & PU Insert Dies', draw: 'pudie',
      short: 'Mark-free bending of stainless, aluminium and coated sheet.',
      seo: 'Nylon and Polyurethane Press Brake Die Manufacturer in Pune',
      intro: 'Nylon insert dies and polyurethane (PU) pad dies form parts without leaving die marks – essential for stainless steel, aluminium, pre-painted and film-coated sheet. Holders are steel; inserts are replaceable consumables.',
      types: ['Nylon insert holders PND-001H / 002H / 003H', 'Nylon V-inserts PNI-010 / 011 / 012 (88°, 60°, 45°, 30°)', 'PU pad holders PPD-001H – PPD-004H', 'Solid (S) and hollow (H) PU inserts'],
      features: ['No scratches or die lines on visible surfaces', 'Replaceable inserts – holders last for years', 'Wide choice of V openings'] },
    { key: '2v', slug: '2v-dies', title: '2-V (Self-Centering) Dies', menu: '2-V (Self-Centering) Dies', draw: 'twov',
      short: 'Reversible double-V dies in self-centering holders.',
      seo: '2V Self-Centering Die Manufacturer in Pune',
      intro: 'Our 2-V system mounts a reversible double-V die in a self-centering holder. Flip the die to change between two V openings; the holder keeps the V centred under the punch every time.',
      types: ['PDD-001H holders, H 55 – 75 mm', 'PDD-002 / 003 / 004 dies H 26 mm (90°, 88°, 60°)', 'PDD-005 30° die H 46 mm', 'PDD-006H adapter + PDS-001 stopper', 'PDD-007 / 008 / 009 dies H 46 mm'],
      features: ['Two V openings in one die', 'Automatic centring – no re-alignment', 'Ratings up to 100 t/m'] },
    { key: 'zbend', slug: 'z-bend-dies', title: 'Z-Bend / Joggle Dies', menu: 'Z-Bend / Joggle Dies', draw: 'zbend',
      short: 'Offset (joggle) bends from 1 to 15 mm in a single stroke.',
      seo: 'Z-Bend and Joggle Die Manufacturer in Pune',
      intro: 'Z-bend (joggle) tools form two opposing bends in a single stroke to create an offset step. Interchangeable PZI inserts in one PZD-001H upper + lower holder cover offsets from 1 mm to 15 mm.',
      types: ['PZD-001H upper + lower holder set', '90° inserts, offset 1.0 – 15.0 mm', '160°, 150° and 140° inserts for shallow steps'],
      features: ['Two bends in one stroke', 'Insert system – one holder, many offsets', 'Sheet thickness up to 3.0 mm'] },
    { key: 'holders', slug: 'holders-clamps', title: 'Die Holders, Punch Holders & Clamps', menu: 'Die Holders, Punch Holders & Clamps', draw: 'holder',
      short: 'Die rails and manual punch clamps for KMC / EURO tooling.',
      seo: 'Press Brake Die Holder and Punch Clamp Manufacturer in Pune',
      intro: 'Retrofit or upgrade your press brake with our die holder rails and manual punch clamps. They accept all KMC / EURO style tooling in this catalogue and make tool changes faster and safer.',
      types: ['PDH-001 die rails, 2100 – 4100 mm', 'PDH-002 die holders with clamp blocks', 'PCL-003 screw-type punch clamps', 'PCL-004 quick-lever punch clamps', 'PU safety insert versions (UN02)'],
      features: ['Accepts KMC / EURO tangs', 'Quick-lever option for fast changes', 'Safety PU insert holds the punch during clamping'] },
    { key: 'shear', slug: 'shear-blades', title: 'Shear Blades & Shearing Machine Knives', menu: 'Shear Blades / Shearing Machine Knives', draw: 'blade',
      short: 'New shear blades plus professional blade resharpening.',
      seo: 'Shearing Machine Blade Manufacturer and Resharpening in Pune',
      intro: 'We manufacture shearing machine knives and supply machine guide-ways for hydraulic and mechanical shears, and we run a dedicated resharpening service that restores worn blades to a clean, square cutting edge.',
      types: ['Straight shear blades for guillotine shears', 'Blades for swing-beam shears', 'Machine guide-ways', 'Blade resharpening service'],
      features: ['Made to your machine’s drawing or sample', 'Precision ground cutting edges', 'Resharpening with controlled stock removal'], noData: true },
    { key: 'special', slug: 'special-application', title: 'Special Application & Custom Tooling', menu: 'Special Application / Custom Tooling', draw: 'special',
      short: 'Tools built to your part drawing – joggles, offsets, profiles.',
      seo: 'Custom Press Brake Tooling Manufacturer in Pune',
      intro: 'When a standard profile cannot make your part, we design a tool for it. Send us your part drawing and we will propose punch and die geometry, check for collisions and manufacture the tooling to suit your press brake.',
      types: ['Custom profile punches and dies', 'Joggle and offset tools', 'Louver, embossing and forming tools', 'Tools for special clamping systems'],
      features: ['Designed from your part drawing', 'Bending-sequence visualisation on request', 'DXF geometry supplied for your CNC library'], noData: true }
  ];

  /* Common text for every product page */
  var whyUs = ['Manufactured in Pune by a team specialised in press brake tooling since 2016', 'Induction hardened working areas: 55 – 60 HRC, 3 – 4 mm deep', 'Three material grades: Economy, Production and Professional', 'Fits press brakes from 50+ manufacturers (KMC / EURO clamping)', '24 h / 48 h / 72 h delivery on stock positions', 'Free 2D DXF geometry for your CNC tool library'];

  /* Bending tonnage table – mild steel, t per metre (catalogue page 05) */
  var tonnage = [
    [6, 5, 1, { 0.5: 2.5, 0.8: 6.5, 1: 10 }], [8, 6, 1.3, { 0.5: 2, 0.8: 5, 1: 8, 1.2: 11 }],
    [10, 7, 1.7, { 0.5: 1.5, 0.8: 4, 1: 6, 1.2: 9, 1.5: 13 }], [12, 9, 2, { 0.8: 3, 1: 5, 1.2: 7, 1.5: 11, 1.8: 16 }],
    [15, 12, 2.7, { 1: 4, 1.2: 6, 1.5: 9, 1.8: 13, 2: 16 }], [20, 15, 3.3, { 1.2: 4, 1.5: 7, 1.8: 10, 2: 13, 2.5: 19 }],
    [26, 18, 4.2, { 1.5: 5, 1.8: 7.5, 2: 10, 2.5: 14, 3: 21 }], [30, 22, 5, { 1.8: 6.5, 2: 8, 2.5: 12, 3: 19, 3.5: 24 }],
    [32, 23, 5.4, { 2: 7.5, 2.5: 11.6, 3: 17, 3.5: 23, 4: 30 }], [37, 25, 5.8, { 2.5: 10, 3: 14.5, 3.5: 20, 4: 26, 4.5: 33 }],
    [42, 29, 6.7, { 3: 13, 3.5: 17, 4: 23, 4.5: 29, 5: 35.5 }], [45, 32, 7.5, { 3.5: 16, 4: 21, 4.5: 27, 5: 33, 6: 48 }],
    [50, 36, 8.3, { 4: 19, 4.5: 24, 5: 30, 6: 43, 7: 58 }], [60, 43, 10, { 4.5: 20, 5: 25, 6: 36, 7: 49, 8: 64 }],
    [70, 50, 11.5, { 5: 21, 6: 31, 7: 42, 8: 55, 9: 69 }], [80, 57, 13.5, { 6: 27, 7: 37, 8: 48, 9: 60, 10: 75 }],
    [90, 64, 15, { 7: 32, 8: 42, 9: 54, 10: 66, 12: 95 }], [100, 71, 17, { 8: 38, 9: 48, 10: 60, 12: 86, 15: 134 }],
    [130, 93, 22, { 9: 37, 10: 46, 12: 66, 15: 103, 18: 149 }], [180, 130, 30, { 10: 33, 12: 48, 15: 75, 18: 107, 20: 133 }],
    [200, 145, 33, { 12: 43, 15: 67, 18: 97, 20: 119 }], [250, 180, 42, { 15: 54, 18: 77, 20: 95 }]
  ];
  var tonnageCols = [0.5, 0.8, 1, 1.2, 1.5, 1.8, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20];

  /* Hemming tonnage (catalogue page 37): S, H, mild, inox, 2S, mild, inox */
  var hemming = [
    ['0.6', '3.0', '9', '15', '1.2', '23', '35'], ['0.8', '3.0', '12', '20', '1.6', '32', '50'],
    ['1.0', '3.5', '15', '25', '2.0', '40', '60'], ['1.25', '3.5', '17', '26', '2.5', '50', '80'],
    ['1.5', '4.6', '22', '38', '3.0', '63', '95'], ['2.0', '5.5', '30', '50', '4.0', '80', '130'],
    ['2.5', '6.5', '55', '–', '5.0', '90', '–'], ['3.0', '8.0', '70', '–', '6.0', '100', '–']
  ];

  var brands = ['Adira', 'AM Machinery', 'Amada', 'Axial', 'Baykal', 'Boschert', 'Bystronic', 'CMU', 'CoastOne', 'Colgar', 'Colly', 'Gilardi', 'Guifil', 'Dener Makina', 'Deratech', 'Durma', 'Edward Pearson', 'Ermaksan', 'Femas', 'Fratelli Farina', 'GADE', 'Gasparini', 'Gecko', 'HACO (Atlantic)', 'Hammerle', 'Hesse', 'Hezinger', 'IMAL', 'Ironmac', 'ITEK', 'Jean Perrot', 'Jodri', 'KAAST', 'Karmet', 'Kingsland', 'Knuth', 'Mecos', 'MVD', 'Nargesa', 'OMAG', 'Peliant', 'Rico', 'Salvagnini', 'Schiavi', 'SMD', 'STR', 'Tabama', 'Teda', 'Vicla', 'Vimercati', 'Warcom', 'Yangli', 'YSD'];

  var KMC = {
    materials: materials, series: series, order: order, categories: categories, whyUs: whyUs,
    tonnage: tonnage, tonnageCols: tonnageCols, hemming: hemming, brands: brands,
    seriesFor: function (key) { return order.filter(function (c) { return series[c].cat === key; }).map(function (c) { return series[c]; }); },
    category: function (key) { return categories.filter(function (c) { return c.key === key; })[0]; }
  };

  root.KMC = KMC;
  if (typeof module !== 'undefined' && module.exports) module.exports = KMC; /* Node (page builder) */
})(typeof window !== 'undefined' ? window : globalThis);
