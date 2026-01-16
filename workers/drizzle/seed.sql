-- Seed Data SQL --

INSERT INTO admin (id, username, password_hash, created_at, updated_at)
VALUES ('idbHhxV-4Hwgd_oib8bZN', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2026-01-16T03:51:27.776Z', '2026-01-16T03:51:27.777Z');

INSERT INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('Rlj8sA8J5W48azUxcWJPM', '두통', '머리가 아픈 증상', '두부', 1, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('kKKjlp1jdhCTyXIMqUOjZ', '피로', '쉽게 지치고 기운이 없음', '전신', 2, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('r2jXwHc28Izr5RmN6RvO_', '소화불량', '음식이 잘 소화되지 않음', '소화기', 3, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('v9J4xpWExiaoqyWGhy4wO', '불면', '잠들기 어렵거나 자주 깸', '신경', 4, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('ArTpUWdKIw-mCU4Rs8H8G', '복통', '배가 아픈 증상', '소화기', 5, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO question (id, symptom_id, question_text, question_type, options, slider_min, slider_max, display_order, is_active, created_at, updated_at)
VALUES ('VocA33us-WchTlaGHSWXz', NULL, '평소 피로감을 느끼는 정도는?', 'radio', '[{"value":1,"label":"거의 없다"},{"value":2,"label":"가끔"},{"value":3,"label":"자주"},{"value":4,"label":"항상"}]', NULL, NULL, 1, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO question (id, symptom_id, question_text, question_type, options, slider_min, slider_max, display_order, is_active, created_at, updated_at)
VALUES ('o6gpKM3-_ZSOo2nKxhUqX', NULL, '식욕은 어떤 편인가요?', 'radio', '[{"value":1,"label":"매우 좋음"},{"value":2,"label":"보통"},{"value":3,"label":"없는 편"},{"value":4,"label":"전혀 없음"}]', NULL, NULL, 2, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO question (id, symptom_id, question_text, question_type, options, slider_min, slider_max, display_order, is_active, created_at, updated_at)
VALUES ('KPSOMMWBGhqOZEdP51TWV', NULL, '수면의 질은 어떤가요?', 'slider', '{"min":0,"max":10,"step":1,"labels":{"0":"매우 나쁨","10":"매우 좋음"}}', 0, 10, 3, 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO syndrome (id, name, description, category, characteristics, is_active, created_at, updated_at)
VALUES ('qBM7k9Z2JlyyPArPesPH9', '기허', '기(氣)가 부족한 상태. 피로, 무기력, 땀이 잘 남', '허증', '{"primarySymptoms":["피로","무기력","호흡곤란"],"tongue":"담백설","pulse":"약맥"}', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO syndrome (id, name, description, category, characteristics, is_active, created_at, updated_at)
VALUES ('BwT2qTQ_p1XYW-bcH4xCl', '담음', '체내에 비정상적인 수분이 정체된 상태', '실증', '{"primarySymptoms":["가래","어지러움","메스꺼움"],"tongue":"태후설","pulse":"활맥"}', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO syndrome (id, name, description, category, characteristics, is_active, created_at, updated_at)
VALUES ('GzS4r6uofDBG6zkb9dygy', '어혈', '혈액 순환이 원활하지 않은 상태', '실증', '{"primarySymptoms":["통증","멍","생리통"],"tongue":"자설","pulse":"삽맥"}', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('fA2wNqsN1l-usmGiuYEFt', '인삼', 'Panax ginseng', '보기(補氣) - 기력을 보충하고 원기를 회복', '보익약', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('bgf_HwUfYFY7cxvjLU6Ia', '황기', 'Astragalus membranaceus', '보기고표(補氣固表) - 기를 보하고 면역력 강화', '보익약', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('LkoPkthrJ7zPcc5abEnX_', '반하', 'Pinellia ternata', '조습화담(燥濕化痰) - 습담을 제거', '화담약', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('swqbmQsdU6QDSNH9JAgH3', '당귀', 'Angelica sinensis', '보혈활혈(補血活血) - 혈을 보하고 순환 촉진', '보혈약', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('kaTZ9ukD8YLDNd2gVEFNW', '천궁', 'Ligusticum chuanxiong', '활혈행기(活血行氣) - 혈액 순환 개선', '활혈약', 1, '2026-01-16T03:51:27.777Z', '2026-01-16T03:51:27.777Z');

INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('e2lbS-WNuduutmLu33s_T', 'qBM7k9Z2JlyyPArPesPH9', 'fA2wNqsN1l-usmGiuYEFt', 2.0, '인삼은 원기를 크게 보하여 기허에 핵심 약재', '2026-01-16T03:51:27.778Z');

INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('lPtfWYa_5xv0JagpKEuqd', 'qBM7k9Z2JlyyPArPesPH9', 'bgf_HwUfYFY7cxvjLU6Ia', 1.8, '황기는 고표작용으로 기허 개선', '2026-01-16T03:51:27.778Z');

INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('3X-GREtsfQXaT5OXQv3_u', 'BwT2qTQ_p1XYW-bcH4xCl', 'LkoPkthrJ7zPcc5abEnX_', 2.0, '반하는 화담의 대표 약재', '2026-01-16T03:51:27.778Z');

INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('nQ1hT0suZ4NGT4hqAOlaR', 'GzS4r6uofDBG6zkb9dygy', 'swqbmQsdU6QDSNH9JAgH3', 1.8, '당귀는 보혈하면서 혈행 촉진', '2026-01-16T03:51:27.778Z');

INSERT INTO syndrome_herb (id, syndrome_id, herb_id, relevance_score, evidence, created_at)
VALUES ('Pnv-85tQi8Fixk0XwmeVM', 'GzS4r6uofDBG6zkb9dygy', 'kaTZ9ukD8YLDNd2gVEFNW', 2.0, '천궁은 활혈행기의 핵심 약재', '2026-01-16T03:51:27.778Z');

INSERT INTO diagnosis_rule (id, syndrome_id, rule_type, condition, weight, is_active, created_at, updated_at)
VALUES ('WNl_HbFVr2XHb7RG1JL1A', 'qBM7k9Z2JlyyPArPesPH9', 'symptom_weight', '{"symptom_name":"피로","min_count":1}', 2.0, 1, '2026-01-16T03:51:27.778Z', '2026-01-16T03:51:27.778Z');

INSERT INTO diagnosis_rule (id, syndrome_id, rule_type, condition, weight, is_active, created_at, updated_at)
VALUES ('RDkhWaJah7mcArVPPf9eQ', 'BwT2qTQ_p1XYW-bcH4xCl', 'symptom_weight', '{"symptom_name":"소화불량","min_count":1}', 1.5, 1, '2026-01-16T03:51:27.778Z', '2026-01-16T03:51:27.778Z');

INSERT INTO diagnosis_rule (id, syndrome_id, rule_type, condition, weight, is_active, created_at, updated_at)
VALUES ('7h_fmhlfe787O4OBLaGWm', 'GzS4r6uofDBG6zkb9dygy', 'symptom_weight', '{"symptom_name":"두통","min_count":1}', 1.5, 1, '2026-01-16T03:51:27.778Z', '2026-01-16T03:51:27.778Z');

-- Treatment Axis SQL --

INSERT INTO treatment_axis (id, syndrome_id, name, description, display_order, created_at, updated_at)
VALUES ('R-f1cmtGMM1uNZKOFZmJ5', 'qBM7k9Z2JlyyPArPesPH9', '보기법(補氣法)', '기를 보충하는 치료 방법', 1, '2026-01-16T03:51:27.779Z', '2026-01-16T03:51:27.779Z');
