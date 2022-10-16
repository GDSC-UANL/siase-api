
interface String {
    capitalizeFirst(): string;
}

String.prototype.capitalizeFirst = function (this: string): string {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}