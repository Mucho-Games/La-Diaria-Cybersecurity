class CoroutineRunner 
{
    constructor() {
        this.coroutines = [];
    }

    start(generatorFn, ...args) {
        const gen = generatorFn(...args);
        const coro = {
            gen,
            wait: null,
            elapsed: 0,
            done: false
        };

        this.coroutines.push(coro);
        return coro; // handle
    }

    stop(coro) {
        coro.done = true;
    }

    update(deltaTime) {
        for (const coro of [...this.coroutines]) {
            if (coro.done) {
                this.coroutines.splice(this.coroutines.indexOf(coro), 1);
                continue;
            }

            coro.elapsed += deltaTime;

            if (coro.wait) {
                if (coro.wait.type === "seconds") {
                    coro.wait.value -= deltaTime;
                    if (coro.wait.value > 0) continue;
                }

                if (coro.wait.type === "until") {
                    if (!coro.wait.condition()) continue;
                }

                coro.wait = null;
            }

            const result = coro.gen.next(deltaTime);

            if (result.done) {
                coro.done = true;
                this.coroutines.splice(this.coroutines.indexOf(coro), 1);
                continue;
            }

            coro.wait = result.value;
        }
    }

    stopAll() 
    {
        this.coroutines.length = 0;
    }
}

function waitSeconds(seconds) {
    return { type: "seconds", value: seconds };
}

function waitUntil(condition) {
    return { type: "until", condition };
}
