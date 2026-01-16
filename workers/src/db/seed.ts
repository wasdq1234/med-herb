/**
 * Seed script for development/testing
 * Usage: Run this against a D1 database to populate initial data
 */

import { nanoid } from 'nanoid';

/**
 * Generate ISO8601 timestamp
 */
function now(): string {
  return new Date().toISOString();
}

/**
 * Sample data based on docs/planning/04-database-design.md
 */
export const seedData = {
  // Admin user
  admin: [
    {
      id: nanoid(),
      username: 'admin',
      // PBKDF2 hash of 'password123' (for development only!)
      passwordHash:
        'N3XVCluIMK3CnRp-Z-xE4adIcXr9U4v87bWxZxejaiDhUnZ-mRQsccAQPnlfeFPL',
      createdAt: now(),
      updatedAt: now(),
    },
  ],

  // Symptoms
  symptoms: [
    {
      id: nanoid(),
      name: '두통',
      description: '머리가 아픈 증상',
      category: '두부',
      displayOrder: 1,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '피로',
      description: '쉽게 지치고 기운이 없음',
      category: '전신',
      displayOrder: 2,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '소화불량',
      description: '음식이 잘 소화되지 않음',
      category: '소화기',
      displayOrder: 3,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '불면',
      description: '잠들기 어렵거나 자주 깸',
      category: '신경',
      displayOrder: 4,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '복통',
      description: '배가 아픈 증상',
      category: '소화기',
      displayOrder: 5,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ],

  // Questions
  questions: [
    {
      id: nanoid(),
      symptomId: null, // General question not tied to specific symptom
      questionText: '평소 피로감을 느끼는 정도는?',
      questionType: 'radio',
      options: JSON.stringify([
        { value: 1, label: '거의 없다' },
        { value: 2, label: '가끔' },
        { value: 3, label: '자주' },
        { value: 4, label: '항상' },
      ]),
      sliderMin: null,
      sliderMax: null,
      displayOrder: 1,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      symptomId: null,
      questionText: '식욕은 어떤 편인가요?',
      questionType: 'radio',
      options: JSON.stringify([
        { value: 1, label: '매우 좋음' },
        { value: 2, label: '보통' },
        { value: 3, label: '없는 편' },
        { value: 4, label: '전혀 없음' },
      ]),
      sliderMin: null,
      sliderMax: null,
      displayOrder: 2,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      symptomId: null,
      questionText: '수면의 질은 어떤가요?',
      questionType: 'slider',
      options: JSON.stringify({
        min: 0,
        max: 10,
        step: 1,
        labels: { 0: '매우 나쁨', 10: '매우 좋음' },
      }),
      sliderMin: 0,
      sliderMax: 10,
      displayOrder: 3,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ],

  // Syndromes
  syndromes: [
    {
      id: nanoid(),
      name: '기허',
      description: '기(氣)가 부족한 상태. 피로, 무기력, 땀이 잘 남',
      category: '허증',
      characteristics: JSON.stringify({
        primarySymptoms: ['피로', '무기력', '호흡곤란'],
        tongue: '담백설',
        pulse: '약맥',
      }),
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '담음',
      description: '체내에 비정상적인 수분이 정체된 상태',
      category: '실증',
      characteristics: JSON.stringify({
        primarySymptoms: ['가래', '어지러움', '메스꺼움'],
        tongue: '태후설',
        pulse: '활맥',
      }),
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '어혈',
      description: '혈액 순환이 원활하지 않은 상태',
      category: '실증',
      characteristics: JSON.stringify({
        primarySymptoms: ['통증', '멍', '생리통'],
        tongue: '자설',
        pulse: '삽맥',
      }),
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ],

  // Herbs
  herbs: [
    {
      id: nanoid(),
      name: '인삼',
      scientificName: 'Panax ginseng',
      effect: '보기(補氣) - 기력을 보충하고 원기를 회복',
      category: '보익약',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '황기',
      scientificName: 'Astragalus membranaceus',
      effect: '보기고표(補氣固表) - 기를 보하고 면역력 강화',
      category: '보익약',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '반하',
      scientificName: 'Pinellia ternata',
      effect: '조습화담(燥濕化痰) - 습담을 제거',
      category: '화담약',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '당귀',
      scientificName: 'Angelica sinensis',
      effect: '보혈활혈(補血活血) - 혈을 보하고 순환 촉진',
      category: '보혈약',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: nanoid(),
      name: '천궁',
      scientificName: 'Ligusticum chuanxiong',
      effect: '활혈행기(活血行氣) - 혈액 순환 개선',
      category: '활혈약',
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ],
};

/**
 * Generate SQL INSERT statements
 * This can be executed directly in D1 console or via wrangler d1 execute
 */
export function generateSeedSQL() {
  const sql: string[] = [];

  // Admin
  seedData.admin.forEach((admin) => {
    sql.push(`
INSERT INTO admin (id, username, password_hash, created_at, updated_at)
VALUES ('${admin.id}', '${admin.username}', '${admin.passwordHash}', '${admin.createdAt}', '${admin.updatedAt}');
    `.trim());
  });

  // Symptoms
  seedData.symptoms.forEach((symptom) => {
    sql.push(`
INSERT INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('${symptom.id}', '${symptom.name}', '${symptom.description}', '${symptom.category}', ${symptom.displayOrder}, ${symptom.isActive ? 1 : 0}, '${symptom.createdAt}', '${symptom.updatedAt}');
    `.trim());
  });

  // Questions
  seedData.questions.forEach((question) => {
    const symptomId = question.symptomId ? `'${question.symptomId}'` : 'NULL';
    const sliderMin = question.sliderMin !== null ? question.sliderMin : 'NULL';
    const sliderMax = question.sliderMax !== null ? question.sliderMax : 'NULL';
    // Escape single quotes in JSON
    const options = question.options.replace(/'/g, "''");

    sql.push(`
INSERT INTO question (id, symptom_id, question_text, question_type, options, slider_min, slider_max, display_order, is_active, created_at, updated_at)
VALUES ('${question.id}', ${symptomId}, '${question.questionText}', '${question.questionType}', '${options}', ${sliderMin}, ${sliderMax}, ${question.displayOrder}, ${question.isActive ? 1 : 0}, '${question.createdAt}', '${question.updatedAt}');
    `.trim());
  });

  // Syndromes
  seedData.syndromes.forEach((syndrome) => {
    const characteristics = syndrome.characteristics.replace(/'/g, "''");
    sql.push(`
INSERT INTO syndrome (id, name, description, category, characteristics, is_active, created_at, updated_at)
VALUES ('${syndrome.id}', '${syndrome.name}', '${syndrome.description}', '${syndrome.category}', '${characteristics}', ${syndrome.isActive ? 1 : 0}, '${syndrome.createdAt}', '${syndrome.updatedAt}');
    `.trim());
  });

  // Herbs
  seedData.herbs.forEach((herb) => {
    sql.push(`
INSERT INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('${herb.id}', '${herb.name}', '${herb.scientificName}', '${herb.effect}', '${herb.category}', ${herb.isActive ? 1 : 0}, '${herb.createdAt}', '${herb.updatedAt}');
    `.trim());
  });

  // Syndrome-Herb relationships
  // 기허 → 인삼, 황기
  const giHeo = seedData.syndromes[0];
  const insam = seedData.herbs[0];
  const hwanggi = seedData.herbs[1];

  sql.push(`
INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('${nanoid()}', '${giHeo.id}', '${insam.id}', 2.0, '인삼은 원기를 크게 보하여 기허에 핵심 약재', '${now()}');
  `.trim());

  sql.push(`
INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('${nanoid()}', '${giHeo.id}', '${hwanggi.id}', 1.8, '황기는 고표작용으로 기허 개선', '${now()}');
  `.trim());

  // 담음 → 반하
  const dameum = seedData.syndromes[1];
  const banha = seedData.herbs[2];

  sql.push(`
INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('${nanoid()}', '${dameum.id}', '${banha.id}', 2.0, '반하는 화담의 대표 약재', '${now()}');
  `.trim());

  // 어혈 → 당귀, 천궁
  const eohyeol = seedData.syndromes[2];
  const danggui = seedData.herbs[3];
  const cheongung = seedData.herbs[4];

  sql.push(`
INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('${nanoid()}', '${eohyeol.id}', '${danggui.id}', 1.8, '당귀는 보혈하면서 혈행 촉진', '${now()}');
  `.trim());

  sql.push(`
INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('${nanoid()}', '${eohyeol.id}', '${cheongung.id}', 2.0, '천궁은 활혈행기의 핵심 약재', '${now()}');
  `.trim());

  // Diagnosis rules (simple examples)
  sql.push(`
INSERT INTO diagnosis_rule (id, syndrome_id, rule_type, condition, weight, is_active, created_at, updated_at)
VALUES ('${nanoid()}', '${giHeo.id}', 'symptom_weight', '{"symptom_name":"피로","min_count":1}', 2.0, 1, '${now()}', '${now()}');
  `.trim());

  sql.push(`
INSERT INTO diagnosis_rule (id, syndrome_id, rule_type, condition, weight, is_active, created_at, updated_at)
VALUES ('${nanoid()}', '${dameum.id}', 'symptom_weight', '{"symptom_name":"소화불량","min_count":1}', 1.5, 1, '${now()}', '${now()}');
  `.trim());

  sql.push(`
INSERT INTO diagnosis_rule (id, syndrome_id, rule_type, condition, weight, is_active, created_at, updated_at)
VALUES ('${nanoid()}', '${eohyeol.id}', 'symptom_weight', '{"symptom_name":"두통","min_count":1}', 1.5, 1, '${now()}', '${now()}');
  `.trim());

  return sql.join('\n\n');
}

/**
 * Generate a treatment_axis sample
 */
export function generateTreatmentAxisSQL() {
  const sql: string[] = [];
  const giHeoId = seedData.syndromes[0].id;

  sql.push(`
INSERT INTO treatment_axis (id, syndrome_id, name, description, display_order, created_at, updated_at)
VALUES ('${nanoid()}', '${giHeoId}', '보기법(補氣法)', '기를 보충하는 치료 방법', 1, '${now()}', '${now()}');
  `.trim());

  return sql.join('\n\n');
}

// For direct execution or testing
if (import.meta.main) {
  console.log('-- Seed Data SQL --\n');
  console.log(generateSeedSQL());
  console.log('\n-- Treatment Axis SQL --\n');
  console.log(generateTreatmentAxisSQL());
}
