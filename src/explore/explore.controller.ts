import { Controller, Sse } from '@nestjs/common'
import { ExploreService } from './explore.service'
import { Observable, map } from 'rxjs'

@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  // handle market events
  @Sse('/explore-events')
  sse(): Observable<any> {
    return this.exploreService
      .getExploreEventsObservable()
      .pipe(map((data) => ({ data: data })))
  }
}
