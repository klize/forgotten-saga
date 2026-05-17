#!/usr/bin/env node
// new-patchnote.mjs — 정식 릴리즈 패치노트 스켈레톤 생성기
//
// forgotten-saga 디렉토리에서 `npm run patchnote` 로 실행한다.
//   1. git pull --ff-only            — CI 가 커밋한 release-info.json 을 받아온다
//   2. public/release-info.json      — version / date 추출
//   3. public/patch-notes.json       — 새 엔트리를 맨 앞에 추가 (이미 있으면 건너뜀)
//   4. public/patch-notes/v<버전>.md — 헤더만 있는 스켈레톤 생성 (이미 있으면 건너뜀)
//
// 정식 릴리즈 전용. 베타(beta-release-info.json)는 다루지 않는다.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...parts) => join(root, ...parts);

function fail(msg) {
  console.error(`[patchnote] 오류: ${msg}`);
  process.exit(1);
}

// 1. git pull — CI 가 만든 release-info.json 커밋을 수신
try {
  console.log('[patchnote] git pull --ff-only ...');
  execSync('git pull --ff-only', { cwd: root, stdio: 'inherit' });
} catch {
  fail('git pull --ff-only 실패. 로컬 변경/충돌을 정리한 뒤 다시 실행하세요.');
}

// 2. release-info.json 에서 version / date
const releaseInfoPath = rel('public', 'release-info.json');
if (!existsSync(releaseInfoPath)) fail(`${releaseInfoPath} 가 없습니다.`);
const { version, date } = JSON.parse(readFileSync(releaseInfoPath, 'utf8'));
if (!version || !date) fail('release-info.json 에 version 또는 date 가 없습니다.');

// 3. patch-notes.json 에 엔트리 prepend (멱등)
const notesJsonPath = rel('public', 'patch-notes.json');
const notes = JSON.parse(readFileSync(notesJsonPath, 'utf8'));
const mdFileName = `v${version}.md`;

if (notes.some((n) => n.version === version)) {
  console.log(`[patchnote] patch-notes.json 에 ${version} 엔트리가 이미 있습니다 — 건너뜀.`);
} else {
  notes.unshift({ version, date, title: `v${version}`, file: mdFileName });
  writeFileSync(notesJsonPath, JSON.stringify(notes, null, 2) + '\n', 'utf8');
  console.log(`[patchnote] patch-notes.json 맨 앞에 ${version} 엔트리 추가.`);
}

// 4. v<버전>.md 스켈레톤 생성 (기존 .md 파일들과 동일하게 CRLF)
const mdPath = rel('public', 'patch-notes', mdFileName);
if (existsSync(mdPath)) {
  console.log(`[patchnote] ${mdFileName} 가 이미 있습니다 — 건너뜀.`);
} else {
  const skeleton = [`# v${version}`, `**${date}**`, '', ''].join('\r\n');
  writeFileSync(mdPath, skeleton, 'utf8');
  console.log(`[patchnote] ${mdFileName} 스켈레톤 생성.`);
}

console.log(`\n[patchnote] 완료. 아래 파일의 본문을 채우세요:\n  public/patch-notes/${mdFileName}`);
