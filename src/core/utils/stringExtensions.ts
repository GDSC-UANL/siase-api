interface String {
    capitalizeFirst(): string;
}

String.prototype.capitalizeFirst = function (this: string): string {
    return this.slice(0) + this.slice(1).toLowerCase();
}