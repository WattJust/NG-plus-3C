var breakDilationReq = [50, "1e4700"]

function initBreakDilationPlayerData() {
    player.dilation.break = {
        unl: false,
        active: false,
        rads: new Decimal(0),
        upgrades: [],
        cp: 0,
    }
    matchTempPlayerBD();
}

function matchTempPlayerBD() {
    tmp.bd = player.dilation.break;
}

function updateBreakDilationTabBtn() {
    if (!tmp.ngp3c) {
        document.getElementById("breakDilationTabbtn").style.display = "none"
        return;
    }
    document.getElementById("breakDilationTabbtn").style.display = ((player.ghostify.hb.higgs > 0)||tmp.bd.unl) ? "" : "none"
}

function breakDilationDisplay() {
    let unl = tmp.bd && tmp.bd.unl
    if (!unl) document.getElementById("breakDilationReq").textContent = "Reach "+breakDilationReq[0]+" Higgs Bosons and "+shortenCosts(new Decimal(breakDilationReq[1]))+" Tachyon Particles to unlock Break Dilation."
    else {
        document.getElementById("breakDilationBtn").textContent = tmp.bd.active?"FIX DILATION":"BREAK DILATION";
        document.getElementById("tachyonParticleAmount2").textContent = shortenMoney(player.dilation.tachyonParticles)
        if (tmp.bd.active) {
            document.getElementById("cherenkovRads").textContent = shorten(tmp.bd.rads);
            document.getElementById("cherenkovRadGain").textContent = shorten(tmp.bdt.radGain);
            document.getElementById("cherenkovRadEffDesc").textContent = tmp.bdt.radEffFlipped ? "multiplies" : "divides"
            document.getElementById("cherenkovRadEff").textContent = shorten(tmp.bdt.radEffFlipped?Decimal.div(1, tmp.bdt.radEff):tmp.bdt.radEff);
            document.getElementById("bd2effflip").textContent = tmp.bdt.radEffFlipped ? "" : "divide "
            for (let i=1;i<=BDUpgs.amt;i++) updateBDUpg(i);
            
            let cpTabShown = (tmp.bd.cp>0||tmp.bd.upgrades.length>=(BDUpgs.defaultAmt+tmp.co.plus3))
            document.getElementById("cosmicOrbDiv").style.display = cpTabShown?"":"none"
            if (cpTabShown) {
                document.getElementById("cosmicOrbs").innerHTML = "<div style='font-size: 20px;'>Cosmic Orbs<br></div>"+getFullExpansion(tmp.bd.cp)+"<div style='font-size: 15px; line-height: 1.5em;'>Requirement: "+shortenCosts(getCosmicOrbReq())+" TP & all BD Upgrades</div>"
                document.getElementById("cosmicOrbs").className = "cosmicOrb"+(canGainCosmicOrb()?"":" unavailablebtn")
                if (tmp.bd.cp>0) {
                    document.getElementById("cosmicOrbPlus1").textContent = getFullExpansion(Math.round((tmp.co.plus1-1)*1e4)/100)+"%"
                    document.getElementById("cosmicOrbPlus2").textContent = "^"+getFullExpansion(Math.round(tmp.co.plus2*100)/100)
                    document.getElementById("cosmicOrbPlus3").textContent = getFullExpansion(tmp.co.plus3)
                    document.getElementById("cosmicOrbMinus1").textContent = getFullExpansion(Math.round((tmp.co.minus1-1)*1e4)/100)+"%"
                    document.getElementById("cosmicOrbMinus2Desc").textContent = tmp.bdt.radEffFlipped ? "bringing" : "raising"
                    document.getElementById("cosmicOrbMinus2").textContent = (tmp.bdt.radEffFlipped?"to the ":"^")+getFullExpansion(Math.round(tmp.co.minus2*100)/100)+(tmp.bdt.radEffFlipped?"th root":"")
                    document.getElementById("cosmicOrbMinus3").textContent = shorten(tmp.co.minus3)
                }
            }
        }
    }
    document.getElementById("dilationBroken").style.display = (unl && tmp.bd.active)?"":"none"
}

function canUnlockBD() { return tmp.ngp3c && (tmp.hb?(tmp.hb.unl && tmp.hb.higgs>=breakDilationReq[0]):false) && player.dilation.tachyonParticles.gte(breakDilationReq[1]) }

function unlockBreakDilation() {
    if ((!tmp.ngp3c)||(!tmp.bd)) return;
    $.notify("Congratulations! You have unlocked Break Dilation!", "success");
    player.dilation.break.unl = true;
    updateBreakDilationUnlocks();
}

function updateBreakDilationUnlocks() {
    let unl = tmp.ngp3c && (tmp.bd?tmp.bd.unl:false);
    document.getElementById("breakDilationReq").style.display = unl ? "none" : ""
    document.getElementById("breakDilationDiv").style.display = unl ? "" : "none"
    document.getElementById("annihilationtabbtn").style.display = unl ? "" : "none"
    if (unl) {
        document.getElementById("bdConfirmBtn").style.display = "inline-block"
        updateCosmicOrbUnlocks()
    }
}

function updateCosmicOrbUnlocks() {
    let unl = tmp.ngp3c && (tmp.bd?tmp.bd.cp>0:false)
    document.getElementById("cosmicOrbEffectsDiv").style.display = unl ? "" : "none";
}

function breakDilation() {
    if (!tmp.ngp3c) return;
    if (!tmp.bd.unl) return;
    if (tmp.bd.active) {
        if (!player.aarexModifications.bdNoConf) if (!confirm("Are you sure you want to Fix Dilation? This will reset your Cherenkov Radiation but also your Tachyon Particles, and will force a Ghostify reset!")) return;
        fixDilationReset();
    } else {
        giveAchievement("Shattered in the 25th Century");
    }
    player.dilation.break.active = !player.dilation.break.active
}

function fixDilationReset() {
    ghostifyReset(false, 0, 0, true)
    player.dilation.tachyonParticles = new Decimal(0);
    player.dilation.bestTP = new Decimal(0);
    player.dilation.bestTPOverGhostifies = new Decimal(0);
    player.dilation.break.rads = new Decimal(0);
}

function breakDilationTick(diff) {
    if (!tmp.ngp3c) return;
    if (!tmp.bd.unl) return;
    
    if (tmp.bd.active) {
        setTachyonParticles(player.dilation.tachyonParticles.max(getDilGain()));
        player.dilation.break.rads = player.dilation.break.rads.plus(tmp.bdt.radGain.times(diff));
    }
}

function getCRGainMult() {
    let mult = new Decimal(1);
    if (hasBDUpg(2)) mult = mult.times(tmp.bdt.upgs[2])
    if (hasBDUpg(3)) mult = mult.times(tmp.bdt.upgs[3].cr)
    return mult.div(tmp.co.minus3);
}

function getCherenkovRadGain() {
    if ((!tmp.ngp3c) || (!tmp.bd.unl) || (!tmp.bd.active)) return new Decimal(0);

    let OoMsBetween = 50;
    let reqmod = Decimal.log10(breakDilationReq[1])
    let tpmod = 1+Math.max(player.dilation.tachyonParticles.plus(1).log10()-reqmod, 0)/OoMsBetween
    let base = tpmod;
    let exp = Math.log10(tpmod)*tmp.co.plus2;
    return Decimal.pow(base, exp).sub(1).max(0).times(getCRGainMult());
}

function getCherenkovRadEff() {
    if ((!tmp.ngp3c) || (!tmp.bd.unl) || (!tmp.bd.active)) return new Decimal(1);

    let exp = 15*tmp.co.minus2;
    if (hasBDUpg(4)) exp /= tmp.bdt.upgs[4].cr+1

    let eff = tmp.bd.rads.plus(1).pow(exp);

    if (hasBDUpg(2)) eff = eff.div(Decimal.pow(tmp.bdt.upgs[2], 25))
    return eff.max(hasBDUpg(12)?0:1);
}

function getBDUpgPower() {
    let power = tmp.co.plus1;
    return power;
}

function BDUpgCostAdj(x) {
    return Decimal.pow(x, tmp.co.minus1);
}

var BDUpgs = {
    amt: 12,
    defaultAmt: 5,
    1: {
        cost: new Decimal(150),
        eff(p) { 
            let x = tmp.bd.rads.plus(1).log10()*10
            let y = Math.sqrt(tmp.bd.rads.plus(1).log10())*25 
            return Math.min(x, y)*p;
        },
    },
    2: {
        cost: new Decimal(400),
        eff(p) { return Decimal.pow(1.1, Math.max(tmp.hb.higgs-30, 0)*p) },
        disp(e) { return shorten(e)+"x gain, "+(tmp.bdt.radEffFlipped?(shorten(Decimal.pow(e, 25))+"x effect"):("/"+shorten(Decimal.pow(e, 25))+" effect")) },
    },
    3: {
        cost: new Decimal(2e4),
        eff(p) { return {
            cr: Math.pow(player.ghostify.bl.am.plus(1).log10()*p+1, .75),
            bam: Decimal.pow(10*p, Math.sqrt(tmp.bd.rads.plus(1).log10()*2)),
        }},
        disp(e) { return shorten(e.bam)+"x BAM gain, "+shorten(e.cr)+"x CR gain" },
    },
    4: {
        cost: new Decimal(5e6),
        eff(p) { 
            let decays = getTotalRadioactiveDecays()*p;
            return {
                cr: Math.log2(decays/40+1),
                rd: Math.log2(tmp.bd.rads.plus(1).log10()*p/10+1),
            }
        },
        disp(e) { return "CR Eff to the "+(e.cr+1).toFixed(2)+"th root, RD neg. eff /"+(e.rd+1).toFixed(2) },
    },
    5: {
        cost: new Decimal(4e7),
        eff(p) { return 1-1/Math.sqrt(Math.log2(tmp.bd.rads.plus(1).log10()*p/10+1)+1) },
        disp(e) { return (e*100).toFixed(2) }
    }, 
    6: {
        cost: new Decimal(4e5),
        eff(p) { return 1-1/(Math.log2(tmp.bd.rads.plus(1).log10()*p+1)+1) },
        disp(e) { return (e*100).toFixed(2) },
    },
    7: {
        cost: new Decimal(1.5e12),
        eff(p) { return Math.round(tmp.bd.cp*p*33000) },
        disp(e) { return getFullExpansion(e) }
    },
    8: {
        cost: new Decimal(8e13),
        eff(p) { return Math.sqrt(Math.log2(tmp.bl.ticks.plus(1).log10()*p+1)+1)-1 },
        disp(e) { return (e*100).toFixed(2) },
    },
    9: {
        cost: new Decimal(5e17),
        eff(p) { return Math.sqrt(tmp.bd.cp*p) },
        disp(e) { return getFullExpansion(Math.round(e*1e3)/10) },
    },
    10: {
        cost: new Decimal(1e21),
        eff(p) { return Math.sqrt(tmp.bd.rads.plus(1).log10()*p/10+1) },
    },
    11: {
        cost: new Decimal(1e27),
        eff(p) { return Math.pow(Math.log2(player.ghostify.ghostParticles.plus(1).log10()*p/400+1)*7+1, 1/3) },
        disp(e) { return getFullExpansion(Math.round(e*100)/100) }
    }, 
    12: {
        cost: new Decimal(225),
        eff(p) { return Math.log10(tmp.bl.upgrades.length+tmp.bd.upgrades.length*6+1)/4+1 },
    },
}

function updateBDUpg(x) {
    let data = BDUpgs[x];
    let cost = BDUpgCostAdj(data.cost)
    let can = tmp.bd.rads.gte(cost);
    let shown = x>BDUpgs.defaultAmt?(x<=tmp.co.plus3+BDUpgs.defaultAmt):true
    document.getElementById("breakDilation"+x).style.display = shown?"":"none"
    document.getElementById("breakDilation"+x).className = "bdupg "+(tmp.bd.upgrades.includes(x)?"breakdilationupgbought":(can?"breakdilationbtn":"dilationupgrebuyablelocked"))
    document.getElementById("breakDilationEff"+x).textContent = BDUpgs[x].disp?BDUpgs[x].disp(tmp.bdt.upgs[x]):shorten(tmp.bdt.upgs[x])
    document.getElementById("breakDilationCost"+x).textContent = shorten(cost)
}

function hasBDUpg(x) { return (tmp.ngp3c&&tmp.bd&&tmp.bdt&&tmp.bdt.upgs)?(tmp.bd.active && tmp.bd.upgrades.includes(x)):false };

function buyBDUpg(x) {
    if ((!tmp.ngp3c)||(!tmp.bd)) return;
    if (tmp.bd.upgrades.includes(x)) return;
    let data = BDUpgs[x];
    let cost = BDUpgCostAdj(data.cost)
    if (tmp.bd.rads.lt(cost)) return;
    player.dilation.break.rads = player.dilation.break.rads.sub(cost);
    player.dilation.break.upgrades.push(x);
}

function getCosmicOrbReq() { 
    if (!(tmp.ngp3c&&tmp.bd)) return new Decimal(1/0)
    let req = new Decimal(tmp.bd.cp>=1?"1e10100":"1e8200")
    let cp = tmp.bd.cp
    if (cp>=1) cp = Math.pow(cp-1, 1.48)+1
    if (cp>=5) cp = Math.pow(cp-4, 0.84)+4
    return Decimal.pow("1e400", Math.pow(cp, 1.5)).times(req)
}
function canGainCosmicOrb() { return (tmp.ngp3c&&tmp.bd)?(player.dilation.tachyonParticles.gte(getCosmicOrbReq()) && tmp.bd.upgrades.length>=(BDUpgs.defaultAmt+tmp.co.plus3)):false }

function cosmicOrbReset() {
    if (!canGainCosmicOrb()) return;
    if (!player.aarexModifications.bdNoConf) if (!confirm("Are you sure you want to force a Fix Dilation reset for a Cosmic Orb?")) return;
    tmp.bd.cp++;
    player.dilation.break.upgrades = [];
    fixDilationReset();

    if (tmp.bd.cp==1) updateCosmicOrbUnlocks();
}

var cosmicOrbEffects = {
    plus1: function(cp) { return Math.sqrt(cp)/4+1 },
    plus2: function(cp) { return Math.sqrt(cp)/2+1 },
    plus3: function(cp) { return Math.min(cp, BDUpgs.amt-5) },
    minus1: function(cp) { 
        if (hasBDUpg(12)) cp /= tmp.bdt.upgs[12]
        return cp/3+1 
    },
    minus2: function(cp) { return cp+1 },
    minus3: function(cp) { 
        if (cp>=2) cp = cp/2+1
        return Decimal.pow(10, cp) 
    },
}

function negaCosmicOrbPower(power) {
    if (power>=4) power = (power-3)*1.5+2.5

    let mult = 1
    if (hasBDUpg(6)) mult -= tmp.bdt.upgs[6]
    return mult * power;
}

function posCosmicOrbPower(power) {
    let mult = 1
    if (hasBDUpg(8)) mult += tmp.bdt.upgs[8]
    return mult * power;
}