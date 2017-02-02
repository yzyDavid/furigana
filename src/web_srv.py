import asyncio
from aiohttp import web


async def handle(request):
    pass


def main():
    app = web.Application()
    app.router.add_get('/api', handle)
    web.run_app(app)


if __name__ == '__main__':
    main()
