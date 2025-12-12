export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
    // Si el numero total de páginas es menor o igual a 7, mostramos todas las páginas
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Si la página actual está entre las primeras 3 páginas
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages-1, totalPages];
    }

    // Si la página actual está entre las últimas 3 páginas
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages-2, totalPages-1, totalPages];
    }

    // Si la página actual está en el medio
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}