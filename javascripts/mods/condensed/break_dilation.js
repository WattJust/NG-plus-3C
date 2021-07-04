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
        if (tmp.bd.active) {
            document.getElementById("cherenkovRads").textContent = shorten(tmp.bd.rads);
            document.getElementById("cherenkovRadGain").textContent = shorten(tmp.bdt.radGain);
            document.getElementById("cherenkovRadEff").textContent = shorten(tmp.bdt.radEff);
            for (let i=1;i<=BDUpgs.amt;i++) updateBDUpg(i);
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
    if (unl) document.getElementById("bdConfirmBtn").style.display = "inline-block"
}

function breakDilation() {
    if (!tmp.ngp3c) return;
    if (!tmp.bd.unl) return;
    if (tmp.bd.active) {
        if (!player.aarexModifications.bdNoConf) if (!confirm("Are you sure you want to Fix Dilation? This will reset your Cherenkov Radiation but also your Tachyon Particles, and will force a Ghostify reset!")) return;
        ghostifyReset(false, 0, 0, true)
        player.dilation.tachyonParticles = new Decimal(0);
        player.dilation.bestTP = new Decimal(0);
        player.dilation.bestTPOverGhostifies = new Decimal(0);
        player.dilation.break.rads = new Decimal(0);
    } else {
        giveAchievement("Shattered in the 25th Century");
    }
    player.dilation.break.active = !player.dilation.break.active
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
    return mult;
}

function getCherenkovRadGain() {
    if ((!tmp.ngp3c) || (!tmp.bd.unl) || (!tmp.bd.active)) return new Decimal(0);

    let OoMsBetween = 50;
    let reqmod = Decimal.log10(breakDilationReq[1])
    let tpmod = 1+Math.max(player.dilation.tachyonParticles.plus(1).log10()-reqmod, 0)/OoMsBetween
    let base = tpmod;
    let exp = Math.log10(tpmod);
    return Decimal.pow(base, exp).sub(1).max(0).times(getCRGainMult());
}

function getCherenkovRadEff() {
    if ((!tmp.ngp3c) || (!tmp.bd.unl) || (!tmp.bd.active)) return new Decimal(1);

    let exp = 15;
    if (hasBDUpg(4)) exp /= tmp.bdt.upgs[4].cr+1

    let eff = tmp.bd.rads.plus(1).pow(exp);

    if (hasBDUpg(2)) eff = eff.div(Decimal.pow(tmp.bdt.upgs[2], 25))
    return eff.plus(1);
}

var BDUpgs = {
    amt: 5,
    1: {
        cost: new Decimal(150),
        eff() { 
            let x = tmp.bd.rads.plus(1).log10()*10
            let y = Math.sqrt(tmp.bd.rads.plus(1).log10())*25 
            return Math.min(x, y);
        },
    },
    2: {
        cost: new Decimal(400),
        eff() { return Decimal.pow(1.1, Math.max(tmp.hb.higgs-30, 0)) },
        disp(e) { return shorten(e)+"x gain, /"+shorten(Decimal.pow(e, 25))+" effect" },
    },
    3: {
        cost: new Decimal(2e4),
        eff() { return {
            cr: Math.pow(player.ghostify.bl.am.plus(1).log10()+1, .75),
            bam: Decimal.pow(10, Math.sqrt(tmp.bd.rads.plus(1).log10()*2)),
        }},
        disp(e) { return shorten(e.bam)+"x BAM gain, "+shorten(e.cr)+"x CR gain" },
    },
    4: {
        cost: new Decimal(5e6),
        eff() { 
            let decays = getTotalRadioactiveDecays();
            return {
                cr: Math.log2(decays/40+1),
                rd: Math.log2(tmp.bd.rads.plus(1).log10()/10+1),
            }
        },
        disp(e) { return "CR Eff to the "+(e.cr+1).toFixed(2)+"th root, RD neg. eff /"+(e.rd+1).toFixed(2) },
    },
    5: {
        cost: new Decimal(4e7),
        eff() { return 1-1/Math.sqrt(Math.log2(tmp.bd.rads.plus(1).log10()/10+1)+1) },
        disp(e) { return (e*100).toFixed(2) }
    }, 
}

function updateBDUpg(x) {
    let data = BDUpgs[x];
    let can = tmp.bd.rads.gte(data.cost);
    document.getElementById("breakDilation"+x).className = "bdupg "+(tmp.bd.upgrades.includes(x)?"breakdilationupgbought":(can?"breakdilationbtn":"dilationupgrebuyablelocked"))
    document.getElementById("breakDilationEff"+x).textContent = BDUpgs[x].disp?BDUpgs[x].disp(tmp.bdt.upgs[x]):shorten(tmp.bdt.upgs[x])
    document.getElementById("breakDilationCost"+x).textContent = shorten(data.cost)
}

function hasBDUpg(x) { return (tmp.ngp3c&&tmp.bd&&tmp.bdt&&tmp.bdt.upgs)?(tmp.bd.active && tmp.bd.upgrades.includes(x)):false };

function buyBDUpg(x) {
    if ((!tmp.ngp3c)||(!tmp.bd)) return;
    if (tmp.bd.upgrades.includes(x)) return;
    let data = BDUpgs[x];
    if (tmp.bd.rads.lt(data.cost)) return;
    player.dilation.break.rads = player.dilation.break.rads.sub(data.cost);
    player.dilation.break.upgrades.push(x);
}