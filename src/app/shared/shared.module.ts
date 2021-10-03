import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientService } from './services/http-client.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [HttpClientService],
})
export class SharedModule {}
