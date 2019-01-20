Unit = function () {
    // Data
    this.health = 3;
    this.fireRate = 1.000;
    this.fireRecharge = 0;
    this.fireRange = 600;
    this.alive = true;
    this.sprite = {};
    this.sprite.key = "enemy";
    this.sprite.frame = "tank1";
    // this.sprite.group = undefined;
    this.projectile = {};
    this.projectile.key = "bullet";
    this.projectile.speed = 1000;

    this.movable = true;
    this.movementSpeed = 500;
    this.command = {};

    this.abilities = [];
    this.damage = 1;
};
