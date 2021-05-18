const canvas = document.querySelector('#canvas')
canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color
        ctx.stroke()
    }

    update() {
        this.draw();
        const angle = Math.atan2(player.y - this.y, player.x - this.x)
        this.velocity.x = Math.cos(angle) * 2 
        this.velocity.y = Math.sin(angle) * 2
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Boss {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity =
        {
            x: Math.random() * 0.5 + 2,
            y: Math.random() * 0.5 + 3
        } // will be a node which take the velocity of the projectile. 
        this.color = `hsla(${Math.random() * 360}, 55%, 55%, 1)`
        this.health = 20;
        this.isChasing = true;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.stroke()
    }

    update() {
        this.draw();
        if (this.isChasing) {

            const angle = Math.atan2(player.y - this.y, player.x - this.x)
            this.velocity.x = Math.cos(angle) * 5
            this.velocity.y = Math.sin(angle) * 5
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.color = `hsla(${Math.random() * 360}, 55%, 55%, 1)`
    }
}

class Obstacle {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        let tempRadius = this.radius
        for (let i = this.radius; i > 5; i -= 5) {
            ctx.beginPath()
            ctx.strokeStyle = this.color
            ctx.arc(this.x, this.y, i, 0, Math.PI * 2);
            ctx.stroke()
        }
    }
}


let score = 0;
const ctx = canvas.getContext('2d');
const projectiles = [];
const enemies = [];
const obstacles = [];
const BossProjectiles = []
const player = new Player((canvas.width / 2), (canvas.height / 2) + 200, 20, 'blue', { x: 0, y: 0 });
const finalBoss = new Boss(0, 80, 40);
let isFinalBoss = false
let enemySpawnInterval = 1000;


function createObstacles() {

    obstacles.push(
        new Obstacle(350 + Math.random() * 50, 450 + Math.random() * 200, 30, 'white')
    )
    obstacles.push(
        new Obstacle(canvas.width / 2 + Math.random() * 50, 250 + Math.random() * 200, 30, 'white')
    )

}

function createEnemies() {
    var intervalId = setInterval(() => {
        let radius = Math.random() * (player.radius - 5) + 5;
        let x
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        }
        let color = `hsla(${Math.random() * 360}, 55%, 55%, 1)`
        const angle = Math.atan2(player.y - y, player.x - x)
        const eVelocity =
        {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        if (score >= 50) {
            clearInterval(intervalId)
            enemies.splice(0, enemies.length)
            isFinalBoss = true;
            return
        }
        enemies.push(new Enemy(x, y, radius, color, eVelocity));

    }, 1000)


}

function updatePlayer() {
    player.update()
}
function updateObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.draw();
    })
}

function updateProjectiles() {
    projectiles.forEach((projectile, index) => {
        projectile.update()
        obstacles.forEach((obstacle) => {
            let dist = Math.hypot(projectile.x - obstacle.x, projectile.y - obstacle.y);
            if (dist - projectile.radius - obstacle.radius < 1) {
                setTimeout(() => {
                    projectiles.splice(index, 1)
                }, 0)
            }

        })
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })
}
function updateEnemies() {
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update()
        let touch = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (touch - player.radius - enemy.radius < 1) {
            cancelAnimationFrame(animateRequist);
            alert('You Lost')
            window.location.href = window.location.href;
        }

        obstacles.forEach((obstacle) => {
            let dist = Math.hypot(obstacle.x - enemy.x, obstacle.y - enemy.y)
            if (dist - obstacle.radius - enemy.radius < 1) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1)
                }, 0)
            }
        })

        projectiles.forEach((projectile, porjectileIndex) => {
            let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1)
                    projectiles.splice(porjectileIndex, 1)
                    score++;
                }, 0)
            }
        })
    })
}

function updateFinalBoss() {
    finalBoss.update();
    let touch = Math.hypot(player.x - finalBoss.x, player.y - finalBoss.y)
    if (touch - player.radius - finalBoss.radius < 1) {
        cancelAnimationFrame(animateRequist);
        alert('You Lost')
        window.location.href = window.location.href;
    }

    if (finalBoss.x + finalBoss.radius < 0 ||
        finalBoss.x - finalBoss.radius > canvas.width ||
        finalBoss.y + finalBoss.radius < 0 ||
        finalBoss.y - finalBoss.radius > canvas.height) {
        finalBoss.isChasing = true;
    }

    obstacles.forEach((obstacle) => {
        let dist = Math.hypot(obstacle.x - finalBoss.x, obstacle.y - finalBoss.y)
        if (dist - obstacle.radius - finalBoss.radius < 1) {
            setTimeout(() => {
                finalBoss.isChasing = false
                finalBoss.velocity.x *= -3
                finalBoss.velocity.y *= -3
            }, 0)
        }
    })

    projectiles.forEach((projectile, porjectileIndex) => {
        let dist = Math.hypot(projectile.x - finalBoss.x, projectile.y - finalBoss.y);
        if (dist - finalBoss.radius - projectile.radius < 1) {
            setTimeout(() => {
                --finalBoss.health
                projectiles.splice(porjectileIndex, 1)
                ++score
            }, 0)
        }
        if (finalBoss.health <= 0) {
            cancelAnimationFrame(animateRequist);
            alert('You Win')
            window.location.href = window.location.href;
        }
    })

}

window.addEventListener('click', (e) => {
    if (document.getElementById('audio').muted) {
        document.getElementById('audio').muted = false
        document.getElementById('audio').volume = 0.5
        document.getElementById('audio').play()
    }
    console.log(projectiles.length)
    const angle = Math.atan2(
        (e.clientY - player.y),
        (e.clientX - player.x),
    );

    const pVelocity =
    {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6,
    }

    projectiles.push(new Projectile(
        player.x,
        player.y,
        5,
        player.color,
        pVelocity
    )
    )
});

window.addEventListener('keydown', (e) => {
    if (document.getElementById('audio').muted) {
        document.getElementById('audio').muted = false
        document.getElementById('audio').volume = 0.5
        document.getElementById('audio').play()
    }
    if (e.code == "KeyW") { player.velocity.y = -10; }
    if (e.code == "KeyS") { player.velocity.y = 10; }
    if (e.code == "KeyA") { player.velocity.x = -10; }
    if (e.code == "KeyD") { player.velocity.x = 10; }
});

window.addEventListener('keyup', (e) => {
    player.velocity.y = 0
    player.velocity.x = 0
});

window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

function animate() {
    animateRequist = requestAnimationFrame(animate);
    ctx.fillStyle = 'white'
    ctx.font = '30px Reggae One'
    ctx.fillText('Score: ' + score, 20, 40)
    ctx.fillStyle = 'rgba(0,0,0, 0.06)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    updatePlayer()
    updateObstacles()
    updateProjectiles()
    if (isFinalBoss) {
        updateFinalBoss();
        updateFinalBossProjectiles()
    } else {
        updateEnemies()
    }
}

animate();
createObstacles()
createEnemies()