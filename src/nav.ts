export function setupJoinForm(f: (url: string) => void) {
  console.log("setting up join form");
  const form = <HTMLFormElement>document.getElementById("joinForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    const roomURLEle = <HTMLInputElement>document.getElementById("roomURL");
    const roomURL = roomURLEle.value;
    f(roomURL);
  };
}

export function setupToggleMic(f: () => void) {
  const btn = <HTMLButtonElement>document.getElementById("mic");
  btn.classList.remove("hidden");
  btn.onclick = (e) => {
    e.preventDefault();
    f();
  };
}

export function setupToggleCam(f: () => void) {
  console.log("setting up cam toggle");
  const btn = <HTMLButtonElement>document.getElementById("cam");
  btn.classList.remove("hidden");
  btn.onclick = (e) => {
    e.preventDefault();
    f();
  };
}

export function updateMicLabel(isMicOn: boolean) {
  console.log("setting up mic toggle");
  const btn = <HTMLButtonElement>document.getElementById("mic");
  const msg = `Toggle mic ${isMicOn ? "off" : "on"}`;
  if (btn.innerText === msg) return;
  btn.innerText = msg;
}

export function updateCamLabel(isCamOn: boolean) {
  const btn = <HTMLButtonElement>document.getElementById("cam");
  const msg = `Toggle cam ${isCamOn ? "off" : "on"}`;
  if (btn.innerText === msg) return;
  btn.innerText = msg;
}
