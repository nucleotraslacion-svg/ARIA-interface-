#!/usr/bin/env node

/**
 * ARIA System Status Check
 * Muestra el estado actual del sistema modular
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'system-config.json');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading configuration:', error.message);
    process.exit(1);
  }
}

function checkPieceExists(piecePath) {
  const fullPath = path.join(__dirname, '..', piecePath);
  return fs.existsSync(fullPath);
}

function getActivationLevel(config) {
  const { pieces } = config;
  const loadedPieces = Object.keys(pieces).filter(key => 
    checkPieceExists(pieces[key].path)
  );
  
  // Determinar nivel de activación
  if (loadedPieces.length === 0) return 0;
  if (loadedPieces.includes('core') && loadedPieces.length === 1) return 1;
  if (loadedPieces.includes('frontend') && loadedPieces.includes('core')) return 2;
  if (loadedPieces.includes('database')) return 3;
  if (loadedPieces.includes('ai_engine')) return 4;
  if (loadedPieces.includes('personality')) return 5;
  if (loadedPieces.includes('memories')) return 6;
  if (loadedPieces.length === 7) return 7;
  
  return Math.min(loadedPieces.length, 7);
}

function displayStatus() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         🧩 ARIA SYSTEM STATUS - MODULAR LEGO         ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  const config = loadConfig();
  const { pieces, activation_levels } = config;
  
  // Check each piece
  const piecesStatus = {};
  Object.keys(pieces).forEach(key => {
    const piece = pieces[key];
    const exists = checkPieceExists(piece.path);
    piecesStatus[key] = {
      ...piece,
      loaded: exists,
      status_icon: exists ? '🟢' : '🔴',
      status_text: exists ? '✓ Loaded' : '✗ Not Loaded'
    };
  });
  
  // Display pieces
  console.log('📦 PIECES STATUS:\n');
  Object.values(piecesStatus).forEach(piece => {
    const bar = piece.loaded ? '█████' : '░░░░░';
    const pct = piece.loaded ? '100%' : '  0%';
    console.log(`  ${piece.status_icon} ${piece.name.padEnd(12)} ${piece.status_text.padEnd(15)} [${bar}] ${pct}`);
  });
  
  // Calculate activation level
  const level = getActivationLevel(config);
  const levelInfo = activation_levels[`level_${level}`];
  const loadedCount = Object.values(piecesStatus).filter(p => p.loaded).length;
  
  console.log('\n' + '─'.repeat(58));
  console.log('\n📊 SYSTEM METRICS:\n');
  console.log(`  Activation Level:     ${level} / 7 (${levelInfo.name})`);
  console.log(`  Functionality:        ${levelInfo.functionality}`);
  console.log(`  Loaded Pieces:        ${loadedCount} / 7`);
  console.log(`  Status:               ${levelInfo.description}`);
  
  // Next steps
  console.log('\n' + '─'.repeat(58));
  console.log('\n🎯 NEXT STEPS:\n');
  
  if (level === 0) {
    console.log('  1. Load PIEZA 1 (CORE) to start the system');
    console.log('  2. Run: npm run activate:level1');
  } else if (level < 7) {
    const nextLevel = activation_levels[`level_${level + 1}`];
    const missingPieces = nextLevel.required_pieces.filter(p => 
      !piecesStatus[p].loaded
    );
    console.log(`  To reach Level ${level + 1} (${nextLevel.name}), you need:`);
    missingPieces.forEach(piece => {
      console.log(`    • Load PIEZA: ${piecesStatus[piece].name}`);
    });
  } else {
    console.log('  ✅ All pieces loaded! System is complete.');
    console.log('  Run: npm run activate:full');
  }
  
  console.log('\n' + '─'.repeat(58));
  console.log('\n💡 QUICK COMMANDS:\n');
  console.log('  npm run status          - Show this status');
  console.log('  npm run missing         - Show missing pieces');
  console.log('  npm run activate:auto   - Activate all loaded pieces');
  console.log('  npm run health          - Run health check\n');
}

// Run
displayStatus();
