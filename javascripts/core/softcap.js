var softcap_data = {
	tickspeedToInfDims: {
		1: {
			func: "expPow",
			start: Decimal.pow(10, 5e15),
			pow: 0.5,
		},
		2: {
			func: "expPow",
			start: Decimal.pow(10, 1e16),
			pow: 0.25,
		},
	},
	dt_log: {
		1: {
			func: "pow",
			start: 4e3,
			pow: 0.6,
			derv: true
		},
		2: {
			func: "pow",
			start: 5e3,
			pow: 0.4,
			derv: true
		},
		3: {
			func: "pow",
			start: 6e3,
			pow: 0.2,
			derv: true
		},
		4: {
			func: "pow",
			start: 8e3,
			pow: 0.6,
			derv: false
		},
		5: {
			func: "pow",
			start: 10e3,
			pow: 0.5,
			derv: false
		}
	},
	ts_reduce_log: {
		1: {
			func: "pow",
			start: 1e6,
			pow() { 
				let pow = 0.75
				if (hasBosonicUpg(53) && tmp.ngp3c) pow = Math.pow(pow, 1/(Math.log10(player.galaxies+1)+1))
				return pow;
			},
			derv: false
		},
		2: {
			func: "pow",
			start: 2e6,
			pow() { 
				let pow = 0.70
				if (hasBosonicUpg(53) && tmp.ngp3c) pow = Math.pow(pow, 1/Math.sqrt(Math.log10(player.galaxies+1)+1))
				return pow;
			},
			derv: false
		},
		3: {
			func: "pow",
			start: 3e6,
			pow() { 
				let pow = 0.65
				if (hasBosonicUpg(53) && tmp.ngp3c) pow = Math.pow(pow, 1/Math.pow(Math.log10(player.galaxies+1)+1, 1/3))
				return pow;
			},
			derv: false
		},
		4: {
			func: "pow",
			start: 4e6,
			pow() { 
				let pow = 0.60
				if (hasBosonicUpg(53) && tmp.ngp3c) pow = Math.pow(pow, 1/Math.pow(Math.log10(player.galaxies+1)+1, 1/4))
				return pow;
			},
			derv: false
		},
		5: {
			func: "pow",
			start: 5e6,
			pow() { 
				let pow = 0.55
				if (hasBosonicUpg(53) && tmp.ngp3c) pow = Math.pow(pow, 1/(Math.log10(Math.log10(player.galaxies+1)+1)+1))
				return pow;
			},
			derv: false
		}
	},
	ts_reduce_log_big_rip: {
		1: {
			func: "pow",
			start: 1e4,
			pow() { 
				let pow = 0.75
				if (hasBosonicUpg(53) && tmp.ngp3c) pow = Math.pow(pow, 1/(Math.log10(player.galaxies+1)+1))
				return pow;
			},
			derv: false
		},
		2: {
			func: "pow",
			start: 2e4,
			pow() { 
				let pow = 0.65
				if (hasBosonicUpg(53) && tmp.ngp3c) pow = Math.pow(pow, 1/Math.sqrt(Math.log10(player.galaxies+1)+1))
				return pow;
			},
			derv: false
		}
	},
	ts11_log_big_rip: {
		1: {
			func: "pow",
			start: 11e4,
			pow: 0.8,
			derv: true
		},
		2: {
			func: "pow",
			start: 13e4,
			pow: 0.7,
			derv: true
		},
		3: {
			func: "pow",
			start: 15e4,
			pow: 0.6,
			derv: true
		},
		4: {
			func: "pow",
			start: 17e4,
			pow: 0.5,
			derv: true
		},
		5: {
			func: "pow",
			start: 19e4,
			pow: 0.4,
			derv: true
		}
	},
	ms322_log: {
		1: {
			func: "pow",
			start: 500,
			pow: 0.75,
			derv: true
		}
	},
	bru1_log: {
		1: {
			func: "pow",
			start: 3e8,
			pow: 0.75,
			derv: false
		},
		2: {
			func: "log",
			start: 1e10,
			pow: 10
		},
		3: {
			func: "pow",
			start: 2e10,
			pow: 0.5,
			derv: true
		},
		4: {
			func: "pow",
			start: 4e10,
			pow: 0.7,
			derv: true
		},
		5: {
			func: "log",
			start: 1e11,
			pow: 11,
			add: -1
		}
	},
	beu3_log: {
		1: {
			func: "pow",
			start: 150,
			pow: 0.5,
			derv: false
		}
	},
	inf_time_log_1: {
		1: {
			func: "pow",
			start: 12e4,
			pow: 0.5,
			derv: false
		},
		2: {
			func: "pow",
			start: 12e6,
			pow: 2/3,
			derv: false
		}
	},
	inf_time_log_1_big_rip: {
		1: {
			func: "pow",
			start: 100,
			pow: 0.5,
			derv: false
		},
		2: {
			func: "pow",
			start: 1e4,
			pow: 0.4,
			derv: false
		},
		3: {
			func: "pow",
			start: 2e4,
			pow: .7,
			derv: true
		}
	},
	inf_time_log_2: {
		1: {
			func: "pow",
			start: 12e7,
			pow: 0.6,
			derv: false
		},
		2: {
			func: "pow",
			start: 16e7,
			pow: 0.5,
			derv: false
		},
		3: {
			func: "pow",
			start: 20e7,
			pow: 0.4,
			derv: false
		}
	},
	ig_log_high: {
		1: { 
			func: "log",
			start: 1e20,
			pow: 10,
			mul: 5
		},
		2: {
			func: "pow",
			start: 1e21,
			pow: 0.2,
			derv: false
		},
		3: { 
			func: "log", 
			start: 1e22,
			pow: 11,
			mul: 4,
			add: 12
		},
		4: {
			func: "pow",
			start: 1e23,
			pow: 0.1,
			derv: false
		}
	},
	bam: {
		1: {
			func: "pow",
			start: new Decimal(1e80),
			pow: 0.9,
			derv: true
		},
		2: {
			func: "pow",
			start: new Decimal(1e90),
			pow: 0.8,
			derv: true
		},
		3: {
			func: "pow",
			start: new Decimal(1e100),
			pow: 0.7,
			derv: true
		},
		4: {
			func: "pow",
			start: new Decimal(1e110),
			pow: 0.6,
			derv: true
		},
		5: {
			func: "pow",
			start: new Decimal(1e120),
			pow: 0.5,
			derv: true
		},
		6: {
			func: "pow",
			start: new Decimal(1e130),
			pow: 0.4,
			derv: true
		}
	},
	idbase: {
		1: {
			func: "pow",
			start: 1e14,
			pow: .90,
			derv: true
		},
		2: {
			func: "pow",
			start: 1e15,
			pow: .85,
			derv: true
		},
		3: {
			func: "pow",
			start: 1e16,
			pow: .80,
			derv: true
		},
		4: {
			func: "pow",
			start: 1e17,
			pow: .75,
			derv: true
		},
		5: {
			func: "pow",
			start: 3e17,
			pow: .70,
			derv: true
		},
		6: {
			func: "pow",
			start: 1e18,
			pow: .65,
			derv: true
		}
	},
	working_ts: {
		1: {
			func: "pow",
			start: 1e15,
			pow: .9,
			derv: true
		},
		2: {
			func: "pow",
			start: 1e16,
			pow: .85,
			derv: true
		},
		3: {
			func: "pow",
			start: 1e17,
			pow: .8,
			derv: true
		}
	},
	bu45: {
		1: {
			func: "pow",
			start: 9,
			pow: .5,
			derv: false
		},
		2: {
			func: "pow",
			start: 25,
			pow: .5,
			derv: false
		},
		3: {
			func: "pow",
			start: 49,
			pow: .5,
			derv: false
		},
		4: {
			func: "pow",
			start: 81,
			pow: .5,
			derv: false
		},
		5: {
			func: "pow",
			start: 121,
			pow: .5,
			derv: false
		}
	},
	EPtoQK: {
		1: {
			func: "pow",
			start: 1e3,
			pow: .8,
			derv: true
		},
		2: {
			func: "pow",
			start: 3e3,
			pow: .7,
			derv: true
		},
		3: {
			func: "pow",
			start: 1e4,
			pow: .6,
			derv: true
		},
		4: {
			func: "pow",
			start: 3e4,
			pow: .5,
			derv: true
		}
	},
	qc3reward: {
		1: {
			func: "pow",
			start: 1331,
			pow: .5,
			derv: false
		}, 
		2: {
			func: "log",
			start: 4096,
			mul: 4 / Math.log10(8), /* log2(4096)=12, so 4/3s that is 16 and 16**3 = 4096 */
			pow: 3
		}
	},
	ngp3cNDs: {
		1: {
			func: "pow",
			start() {
				let start = new Decimal(1e50);
				if (player.timestudy.studies.includes(63)) start = start.times(ts63Eff());
				if (hasNU(6)) start = new Decimal(1/0);
				return start;
			},
			pow() {
				let pow = 1/3;
				if (player.timestudy.studies.includes(63)) pow = Math.sqrt(pow)
				if (inQCModifier("sp")) pow /= 5
				return pow;
			},
			derv: false,
		},
		2: {
			func: "pow",
			start() {
				let start = new Decimal(Number.MAX_VALUE);
				if (player.timestudy.studies.includes(63)) start = start.times(ts63Eff());
				return start;
			},
			pow() {
				let pow = 1/4;
				if (player.timestudy.studies.includes(63)) pow = Math.sqrt(pow)
				if (inQCModifier("sp")) pow /= 5
				return pow;
			},
			derv: false,
		},
		3: {
			func: "pow",
			start: new Decimal("1e10000"),
			pow() {
				let pow = 1/7
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
		4: {
			func: "pow",
			start: new Decimal("1e25000000"),
			pow() {
				let pow = 1/11
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
		5: {
			func: "pow",
			start: new Decimal("1e175000000"),
			pow() {
				let pow = 1/17
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
		6: {
			func: "pow",
			start() {
				let start = Decimal.pow(10, 1.6e9);
				if (player.masterystudies.includes("d13") && tmp.ngp3c) start = start.times(getTreeUpgradeEffect(10));
				return start;
			},
			pow() {
				let pow = 1/23
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
	},
	ngp3cTS: {
		1: {
			func: "pow",
			start: Number.MAX_VALUE,
			pow() { 
				let pow = QCIntensity(7)?1/2:(player.challenges.includes("postcngc_2")?2/5:1/3)
				if (hasBosonicUpg(63)) pow = Math.pow(pow, 1-tmp.blu[63]);
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
		2: {
			func: "pow",
			start: new Decimal("1e1000"),
			pow() { 
				let pow = QCIntensity(7)?0.43:(player.challenges.includes("postcngc_2")?13/40:1/4)
				if (hasBosonicUpg(63)) pow = Math.pow(pow, 1-tmp.blu[63]);
				if (inQCModifier("sp")) pow /= 5
				return pow 
			},
			derv: false,
		},
		3: {
			func: "pow",
			start: new Decimal("1e25000"),
			pow() { 
				let pow = QCIntensity(7)?0.2324:1/7 
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
		4: {
			func: "pow",
			start: new Decimal("1e120000000"),
			pow() { 
				let pow = QCIntensity(7)?0.16556:1/11 
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
		5: {
			func: "pow",
			start() {
				let start = Decimal.pow(10, 250e9);
				if (player.ghostify.neutrinos.boosts >= 12 && tmp.ngp3c && tmp.nb) start = start.pow(tmp.nb[12]||1);
				return start;
			},
			pow() {
				let pow = 1/13
				if (inQCModifier("sp")) pow /= 5
				return pow
			},
			derv: false,
		},
	},
	ngp3cIP: {
		1: {
			func: "pow",
			start: 1e10,
			pow() { 
				let pow = (player.aarexModifications.ngp3c && player.challenges.includes("postc6"))?.875:.5 
				if (player.timestudy.studies.includes(181)) pow = Math.pow(pow, .1);
				return pow;
			},
			derv: false,
		},
		2: {
			func: "pow",
			start: 1e30,
			pow() { 
				let pow = (player.aarexModifications.ngp3c && player.challenges.includes("postc6"))?5/6:1/3 
				if (player.timestudy.studies.includes(181)) pow = Math.pow(pow, .1);
				return pow;
			},
			derv: false,
		},
		3: {
			func: "pow",
			start: new Decimal("1e10000"),
			pow() { return player.timestudy.studies.includes(181)?Math.pow(.25, .1):(1/4) },
			derv: false,
		},
		4: {
			func: "pow",
			start() {
				let s = new Decimal("1e100000");
				if (hasNU(12) && tmp.qu.bigRip.active) s = s.times(tmp.nu[4].meta);
				return s;
			},
			pow: 1/5,
			derv: false,
		},
		5: {
			func: "pow",
			start: new Decimal("1e950000"),
			pow: 1/23,
			derv: false,
		},
	},
	ngp3cSAC: {
		1: {
			func: "pow",
			start: 1e25,
			pow() {
				let pow = 1/3
				if (player.timestudy.studies.includes(196)) pow = Math.pow(pow, .2);
				return pow;
			},
			derv: false,
		},
		2: {
			func: "pow",
			start: new Decimal(Number.MAX_VALUE),
			pow() {
				let pow = 1/4
				if (player.timestudy.studies.includes(196)) pow = Math.pow(pow, .2);
				return pow;
			},
			derv: false,
		},
	},
	condenseRepl: {
		1: {
			func: "pow",
			start: 1e6,
			pow: 1/2,
			derv: false,
		},
		2: {
			func: "log",
			start: 1e9,
			mul: Math.sqrt(1e9)/9,
			pow: 2,
		},
	},
	ngp3cEP: {
		1: {
			func: "pow",
			start: 1e10,
			pow() {
				let ret = 1/2;
				if (player.dilation.upgrades.includes("ngp3c9")) ret = Math.pow(ret, 0.6);
				return ret;
			},
			derv: false,
		},
		2: {
			func: "pow",
			start: 1e100,
			pow() {
				let ret = 1/3;
				if (player.dilation.upgrades.includes("ngp3c9")) ret = Math.pow(ret, 0.6);
				return ret;
			},
			derv: false,
		},
		3: {
			func: "pow",
			start: new Decimal(Number.MAX_VALUE),
			pow() {
				let ret = 1/4;
				if (player.dilation.upgrades.includes("ngp3c9")) ret = Math.pow(ret, 0.6);
				return ret;
			},
			derv: false,
		},
		4: {
			func: "pow",
			start: new Decimal("1e800"),
			pow() {
				let ret = 1/7;
				if (player.dilation.upgrades.includes("ngp3c9")) ret = Math.pow(ret, 0.6);
				return ret;
			},
			derv: false,
		},
	},
	ngp3cIDs: {
		1: {
			func: "pow",
			start: new Decimal("1e7500"),
			pow() { 
				let ret = 0.1
				if (player.masterystudies.includes("t260")) ret = Math.pow(ret, 0.05);
				return ret;
			},
			derv: false,
		},
		2: {
			func: "pow",
			start: new Decimal("1e50000"),
			pow() { 
				let ret = 0.08
				if (player.masterystudies.includes("t260")) ret = Math.pow(ret, 0.05);
				return ret;
			},
			derv: false,
		},
		3: {
			func: "pow",
			start: Decimal.pow(10, 2e16),
			pow: 0.04,
			derv: false,
		},
	},
	ngp3cTDs: {
		1: {
			func: "pow",
			start: new Decimal("1e5000"),
			pow() { 
				let ret = 1/3
				if (player.masterystudies.includes("t260")) ret = Math.pow(ret, 0.05);
				return ret;
			},
			derv: false,
		},
	},
	ngp3cEC13: {
		1: {
			func: "expPow",
			start() { 
				let start = Decimal.pow(10, 7.5e7);
				if (ghostified && player.ghostify.neutrinos.boosts>8 && tmp.qu.bigRip.active) start = start.times(tmp.nb[9]);
				return start;
			},
			pow: 0.6,
		},
		2: {
			func: "log",
			start: Decimal.pow(10, 1e9),
			pow: 1e9/9,
		},
		3: {
			func: "expPow",
			start: Decimal.pow(10, 1e10),
			pow: .3,
		},
	},
	ngp3cDT: {
		1: {
			func: "pow",
			start: new Decimal(1e6),
			pow() {
				let ret = 1/2;
				if (player.dilation.upgrades.includes("ngp3c9")) {
					let mag = 1 + player.dilation.upgrades.filter(function(x) {
						let ngpp = String(x).split("ngpp")[1];
						if (ngpp ? (Number(ngpp) ? Number(ngpp)>=3 : false) : false) return true;
						else return false
					}).length/(player.dilation.upgrades.includes("ngpp5")?3:5);
					ret = Math.pow(ret, Math.pow(0.9, mag));
				}
				return ret;
			},
			derv: false,
		},
		2: {
			func: "pow",
			start: new Decimal(1e94),
			pow: 1/3,
			derv: false,
		},
		3: {
			func: "expPow",
			start() {
				let start = new Decimal("1e2000");
				if (hasBosonicUpg(12)) start = start.times(tmp.blu[12])
				return start;
			},
			pow: 0.95,
		},
		4: {
			func: "expPow",
			start: new Decimal("1e15000"),
			pow: 0.75,
		},
	},
	ngp3cTP: {
		1: {
			func: "pow",
			start: new Decimal(1e10),
			pow() {
				let ret = 1/3;
				let bd5 = hasBDUpg(5)
				if (bd5) ret = Math.pow(ret, (1-tmp.bdt.upgs[5])*Math.pow(.9, 7/3))
				else if (player.dilation.upgrades.includes("ngp3c9")) {
					let mag = 1 + player.dilation.upgrades.filter(function(x) {
						let ngpp = String(x).split("ngpp")[1];
						if (ngpp ? (Number(ngpp) ? Number(ngpp)>=3 : false) : false) return true;
						else return false;
					}).length/(player.dilation.upgrades.includes("ngpp5")?3:5);
					ret = Math.pow(ret, Math.pow(0.9, mag));
				}
				return ret;
			},
			derv: false,
		},
		2: {
			func: "pow",
			start: new Decimal(1e75),
			pow: 1/4,
			derv: false,
		},
		3: {
			func: "pow",
			start() { 
				let exp = 1;
				if (hasAch("ng3pc11") && !tmp.qu.bigRip.active) exp = 15;
				if (hasBosonicUpg(61) && tmp.ngp3c) exp *= tmp.blu[61]
				return Decimal.pow(Number.MAX_VALUE, exp);
			},
			pow: 1/5,
			derv: false,
		},
		4: {
			func: "expPow",
			start: new Decimal("1e10000"),
			pow: .95,
		},
	},
	ngp3cMPTD: {
		1: {
			func: "expPow",
			start() {
				let start = new Decimal("1e8000000");
				if (player.masterystudies.includes("t332")) start = start.times(getMTSMult(332));
				if (player.masterystudies.includes("d13")) start = start.pow(getTreeUpgradeEffect(12));
				return start;
			},
			pow: 0.95,
		},
	},
	ngp3cMDs: {
		1: {
			func: "pow",
			start: new Decimal(Number.MAX_VALUE),
			pow: 1/3,
		},
		2: {
			func: "pow",
			start: new Decimal("1e500000"),
			pow: 0.15,
		},
	},
	ngp3cTS263: {
		1: {
			func: "expPow",
			start: new Decimal("1e30000"),
			pow: 0.2
		},
	},
	ngp3cTS273: {
		1: {
			func: "pow",
			start: new Decimal(5e92),
			pow: .4,
		},
		2: {
			func: "expPow",
			start: new Decimal(1e102),
			pow: .7,
		},
	},
	ngp3cQK: {
		1: {
			func: "pow",
			start() { 
				let s = new Decimal(1e200);
				if (hasNU(8)) s = s.times(Decimal.pow(2, tmp.qu.multPower.total));
				if (hasBosonicUpg(12)) s = s.times(tmp.blu[12])
				return s;
			},
			pow: 1/3,
			derv: false,
		},
	},
	ngp3cFBPE: {
		1: {
			func: "expPow",
			start: new Decimal("1e200000"),
			pow: 0.75,
		},
	},
	ngp3cGHP: {
		1: {
			func: "pow",
			start: Decimal.pow(Number.MAX_VALUE, 1.4),
			pow: 1/3,
			derv: false,
		},
	},
}

var softcap_vars = {
	pow: ["start", "pow", "derv"],
	expPow: ["start", "pow"],
	log: ["pow", "mul", "add"],
	logshift: ["shift", "pow", "add"]
}

var softcap_funcs = {
	pow: function(x, start, pow, derv = false, rev=false) {
		if (typeof start == "function") start = start()
		if (typeof pow == "function") pow = pow()
		if (typeof derv == "function") derv = derv()
		if (x > start) {
			if (rev) {
				x /= start
				if (derv) x = (x - 1) * pow + 1
				x = Math.pow(x, 1/pow) * start
				return x
			} else {
				x = Math.pow(x / start, pow)
				if (derv) x = (x - 1) / pow + 1
				x *= start
				return x
			}
		} 
		return x
	},
	pow_decimal: function(x, start, pow, derv = false, rev=false) {
		if (typeof start == "function") start = start()
		if (typeof pow == "function") pow = pow()
		if (typeof derv == "function") derv = derv()
		if (Decimal.gt(x, start)) {
			if (rev) {
				x = Decimal.div(x, start)
				if (derv) x = x.sub(1).times(pow).add(1)
				x = x.root(pow).times(start)
				return x
			} else {
				x = Decimal.div(x, start).pow(pow)
				if (derv) x = x.sub(1).div(pow).add(1)
				x = x.times(start)
				return x
			}
		}
		return x
	},
	expPow: function(x, start, pow, y, rev=false) {
		if (typeof start == "function") start = start()
		if (typeof pow == "function") pow = pow()
		if (x > start) {
			if (rev) {
				x /= start
				x = Math.pow(10, Math.pow(Math.log10(Math.max(x, 1)), 1/pow)) * start
				return x
			} else {
				x = Math.pow(10, Math.pow(Math.log10(x / start), pow))
				x *= start
				return x
			}
		} 
		return x
	},
	expPow_decimal: function(x, start, pow, y, rev=false) {
		if (typeof start == "function") start = start()
		if (typeof pow == "function") pow = pow()
		if (Decimal.gt(x, start)) {
			if (rev) {
				x = Decimal.div(x, start)
				x = Decimal.pow(10, Decimal.pow(Decimal.log10(Decimal.max(x, 1)), 1/pow)).times(start)
				return x
			} else {
				x = Decimal.pow(10, Decimal.pow(Decimal.div(x, start).log10(), pow))
				x = x.times(start)
				return x
			}
		}
		return x
	},
	log: function(x, pow = 1, mul = 1, add = 0, rev=false) {
		if (typeof pow == "function") pow = pow()
		if (typeof mul == "function") mul = mul()
		if (typeof add == "function") add = add()
		var x2;
		if (rev) x2 = Math.pow(10, (Math.pow(x, 1/pow) - add) / mul)
		else x2 = Math.pow(Math.log10(x) * mul + add, pow)
		return rev ? Math.max(x, x2) : Math.min(x, x2)
	},
	log_decimal: function(x, pow = 1, mul = 1, add = 0, rev=false) {
		if (typeof pow == "function") pow = pow()
		if (typeof mul == "function") mul = mul()
		if (typeof add == "function") add = add()
		var x2;
		if (rev) x2 = Decimal.pow(10, (Decimal.pow(x, 1/pow) - add) / mul)
		else x2 = Math.pow(Decimal.log10(x) * mul + add, pow)
		return rev ? Decimal.max(x, x2) : Decimal.min(x, x2)
	},
	logshift: function (x, shift, pow, add = 0, rev=false){
		if (typeof pow == "function") pow = pow()
		if (typeof shift == "function") shift = shift()
		if (typeof add == "function") add = add()
		var x2;
		if (rev) x2 = Math.pow(10, Math.pow(x - add, 1/pow)) / shift
		else x2 = Math.pow(Math.log10(x * shift), pow) + add
		return rev ? Math.max(x, x2) : Math.min(x, x2)
	}
}

function do_softcap(x, data, num, rev=false) {
	var data = data[num]
	if (data === undefined) return
	var func = data.func
	if (func == "log" && data["start"]) if (new Decimal(x).lt(data["start"])) return x
	var vars = softcap_vars[func]
	if (x + 0 != x || x instanceof Decimal) func += "_decimal"
	return softcap_funcs[func](x, data[vars[0]], data[vars[1]], data[vars[2]], rev)
}

function softcap(x, id, max = 1/0) {
	var data = softcap_data[id]
	if (tmp.ngp3 && tmp.qu.bigRip.active) {
		var big_rip_data = softcap_data[id + "_big_rip"]
		if (big_rip_data !== undefined) data = big_rip_data
	}

	var sc = 1
	var stopped = false
	while (!stopped && sc <= max) {
		var y = do_softcap(x, data, sc)
		if (y !== undefined) {
			x = y
			if (x instanceof Decimal || x+0!=x) x = new Decimal(x)
			sc++
		} else stopped = true
	}
	return x
}


function reverse_softcap(x, id, max=1/0) {
	var data = softcap_data[id]
	if (tmp.ngp3 && tmp.qu.bigRip.active) {
		var big_rip_data = softcap_data[id + "_big_rip"]
		if (big_rip_data !== undefined) data = big_rip_data
	}

	var sc = Math.min(max, Object.keys(data).length)
	var stopped = false
	while (!stopped && sc > 0) {
		var y = do_softcap(x, data, sc, true)
		if (y !== undefined) {
			x = y
			if (x instanceof Decimal || x+0!=x) x = new Decimal(x)
			sc--
		} else stopped = true
	}
	return x
}