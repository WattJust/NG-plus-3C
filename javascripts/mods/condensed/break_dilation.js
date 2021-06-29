var breakDilationReq = [50, "1e4700"]

function updateBreakDilationTabBtn() {
    if (!tmp.ngp3c) {
        document.getElementById("breakDilationTabbtn").style.display = "none"
        return;
    }
    document.getElementById("breakDilationTabbtn").style.display = player.ghostify.hb.higgs > 0 ? "" : "none"
}

function breakDilationDisplay() {
    document.getElementById("breakDilationReq").textContent = "Reach "+breakDilationReq[0]+" Higgs Bosons and "+shortenCosts(new Decimal(breakDilationReq[1]))+" Tachyon Particles to unlock Break Dilation (NOT IMPLEMENTED YET)."
}